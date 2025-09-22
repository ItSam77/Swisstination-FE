import { useState, useEffect } from 'react'
import { authAPI, destinationAPI, reviewAPI } from '../services/api'
import CloudBackground from '../components/CloudBackground'
import profileImage from '../assets/profile.png'
import ThankYou from './thankYou'

const Review = () => {
  const [user, setUser] = useState(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [destinationSearch, setDestinationSearch] = useState('')
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [destinations, setDestinations] = useState([])
  const [filteredDestinations, setFilteredDestinations] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [submittedData, setSubmittedData] = useState({ destination: '', rating: 0 })

  useEffect(() => {
    fetchUserProfile()
    fetchDestinations()
  }, [])

  // Filter destinations when search input changes
  useEffect(() => {
    if (destinationSearch.length === 0) {
      // Show all destinations when input is empty
      setFilteredDestinations(destinations)
      setShowDropdown(destinations.length > 0)
    } else if (destinationSearch.length >= 1) {
      // Filter destinations based on search input (changed from 3 to 1)
      const filtered = destinations.filter(dest =>
        dest.nama_destinasi.toLowerCase().includes(destinationSearch.toLowerCase())
      )
      setFilteredDestinations(filtered)
      setShowDropdown(true)
    } else {
      setFilteredDestinations([])
      setShowDropdown(false)
    }
  }, [destinationSearch, destinations])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false)
      }
    }

    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showProfileDropdown])

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getCurrentUser()
      setUser(response.user)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchDestinations = async () => {
    setIsLoadingDestinations(true)
    try {
      console.log('Fetching destinations...')
      // Fetch all destinations (1-37) from database
      const response = await destinationAPI.getAllDestinations()
      console.log('Destinations API response:', response)
      
      if (response && response.destinations) {
        // Sort by destinasi_id to get 1-37 in order
        const sortedDestinations = response.destinations.sort((a, b) => {
          const aId = parseInt(a.destinasi_id) || 0
          const bId = parseInt(b.destinasi_id) || 0
          return aId - bId
        })
        setDestinations(sortedDestinations)
        console.log(`Loaded ${sortedDestinations.length} destinations for autocomplete:`, sortedDestinations.slice(0, 3))
      } else {
        console.log('No destinations data in response:', response)
        setMessage('No destinations available at the moment.')
      }
    } catch (error) {
      console.error('Error fetching destinations:', error)
      console.error('Error details:', error.message)
      
      // Create fallback destinations for development/testing (1-37)
      const fallbackDestinations = [
        { destinasi_id: "1", nama_destinasi: "Matterhorn", kategori_id: 1, deskripsi: "Iconic mountain peak" },
        { destinasi_id: "2", nama_destinasi: "Jungfraujoch", kategori_id: 1, deskripsi: "Top of Europe" },
        { destinasi_id: "3", nama_destinasi: "Lake Geneva", kategori_id: 2, deskripsi: "Beautiful alpine lake" },
        { destinasi_id: "4", nama_destinasi: "Rhine Falls", kategori_id: 3, deskripsi: "Europe's most powerful waterfall" },
        { destinasi_id: "5", nama_destinasi: "Grindelwald", kategori_id: 1, deskripsi: "Charming alpine village" },
        { destinasi_id: "6", nama_destinasi: "Zermatt", kategori_id: 1, deskripsi: "Car-free mountain resort" },
        { destinasi_id: "7", nama_destinasi: "Interlaken", kategori_id: 2, deskripsi: "Adventure sports capital" },
        { destinasi_id: "8", nama_destinasi: "Lucerne", kategori_id: 4, deskripsi: "Historic lakeside city" },
        { destinasi_id: "9", nama_destinasi: "Montreux", kategori_id: 4, deskripsi: "Riviera of Lake Geneva" },
        { destinasi_id: "10", nama_destinasi: "Appenzell", kategori_id: 5, deskripsi: "Traditional Swiss culture" },
        { destinasi_id: "11", nama_destinasi: "St. Moritz", kategori_id: 6, deskripsi: "Luxury alpine resort" },
        { destinasi_id: "12", nama_destinasi: "Engelberg", kategori_id: 1, deskripsi: "Mountain paradise" },
        { destinasi_id: "13", nama_destinasi: "Wengen", kategori_id: 1, deskripsi: "Car-free ski resort" },
        { destinasi_id: "14", nama_destinasi: "Saas-Fee", kategori_id: 1, deskripsi: "Pearl of the Alps" },
        { destinasi_id: "15", nama_destinasi: "Andermatt", kategori_id: 1, deskripsi: "Four-season mountain destination" },
        { destinasi_id: "16", nama_destinasi: "Davos", kategori_id: 1, deskripsi: "High alpine city" },
        { destinasi_id: "17", nama_destinasi: "Arosa", kategori_id: 1, deskripsi: "Peaceful mountain retreat" },
        { destinasi_id: "18", nama_destinasi: "Verbier", kategori_id: 1, deskripsi: "Premier ski destination" },
        { destinasi_id: "19", nama_destinasi: "Crans-Montana", kategori_id: 1, deskripsi: "Sunny plateau resort" },
        { destinasi_id: "20", nama_destinasi: "Lauterbrunnen", kategori_id: 3, deskripsi: "Valley of 72 waterfalls" },
        { destinasi_id: "21", nama_destinasi: "Gimmelwald", kategori_id: 1, deskripsi: "Hidden mountain gem" },
        { destinasi_id: "22", nama_destinasi: "Murren", kategori_id: 1, deskripsi: "Car-free alpine village" },
        { destinasi_id: "23", nama_destinasi: "Kleine Scheidegg", kategori_id: 1, deskripsi: "Mountain railway junction" },
        { destinasi_id: "24", nama_destinasi: "First Cliff Walk", kategori_id: 7, deskripsi: "Thrilling mountain walkway" },
        { destinasi_id: "25", nama_destinasi: "Aletsch Glacier", kategori_id: 8, deskripsi: "Largest glacier in Alps" },
        { destinasi_id: "26", nama_destinasi: "Titlis", kategori_id: 1, deskripsi: "Glacier paradise" },
        { destinasi_id: "27", nama_destinasi: "Pilatus", kategori_id: 1, deskripsi: "Dragon mountain" },
        { destinasi_id: "28", nama_destinasi: "Rigi", kategori_id: 1, deskripsi: "Queen of the mountains" },
        { destinasi_id: "29", nama_destinasi: "Stanserhorn", kategori_id: 1, deskripsi: "Open-air cable car" },
        { destinasi_id: "30", nama_destinasi: "Schilthorn", kategori_id: 1, deskripsi: "007 James Bond location" },
        { destinasi_id: "31", nama_destinasi: "Gornergrat", kategori_id: 1, deskripsi: "Matterhorn viewpoint" },
        { destinasi_id: "32", nama_destinasi: "Klein Matterhorn", kategori_id: 1, deskripsi: "Highest cable car station" },
        { destinasi_id: "33", nama_destinasi: "Glacier 3000", kategori_id: 1, deskripsi: "Year-round snow paradise" },
        { destinasi_id: "34", nama_destinasi: "Corvatsch", kategori_id: 1, deskripsi: "Engadin's sunny mountain" },
        { destinasi_id: "35", nama_destinasi: "Diavolezza", kategori_id: 1, deskripsi: "Devil's peak viewpoint" },
        { destinasi_id: "36", nama_destinasi: "Piz Gloria", kategori_id: 1, deskripsi: "Revolving restaurant summit" },
        { destinasi_id: "37", nama_destinasi: "Monte Generoso", kategori_id: 1, deskripsi: "Flower mountain" }
      ]
      
      console.log('Using fallback destinations for testing')
      setDestinations(fallbackDestinations)
      setMessage(`Warning: Using sample destinations. API Error: ${error.message}`)
    } finally {
      setIsLoadingDestinations(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setShowProfileDropdown(false)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
    
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'login'}))
  }

  const handleBackToDashboard = () => {
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'landingpage'}))
  }

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination)
    setDestinationSearch(destination.nama_destinasi)
    setShowDropdown(false)
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setDestinationSearch(value)
    
    // Clear selected destination if user is typing new search
    if (selectedDestination && value !== selectedDestination.nama_destinasi) {
      setSelectedDestination(null)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!selectedDestination || rating === 0) {
      setMessage('Please select a destination and provide a rating')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const reviewData = {
        destination_id: selectedDestination.destinasi_id,
        rating: rating,
        review: review || null // Optional review text
      }
      
      console.log('Submitting review:', reviewData)
      
      // Submit review via API
      const response = await reviewAPI.submitReview(reviewData)
      
      // Store submitted data for thank you page
      setSubmittedData({
        destination: selectedDestination.nama_destinasi,
        rating: rating
      })
      
      // Show thank you page instead of just message
      setShowThankYou(true)
      
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`text-3xl transition-colors duration-200 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400`}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  // Show thank you page if review submitted successfully
  if (showThankYou) {
    return (
      <ThankYou 
        submittedDestination={submittedData.destination}
        submittedRating={submittedData.rating}
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <CloudBackground />
      
      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-800 font-medium">Logging out...</p>
            <p className="text-gray-600 text-sm mt-1">Please wait</p>
          </div>
        </div>
      )}
      
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-8 w-full max-w-2xl relative z-10">
        {/* Header with profile dropdown */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBackToDashboard}
              className="mr-4 p-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Write a Review</h1>
              <p className="text-gray-700">Share your travel experience</p>
            </div>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 p-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all duration-200 group"
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-white/30 group-hover:border-white/50 transition-all duration-200"
              />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-600">{user?.email || 'user@example.com'}</p>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200/50">
                  <div className="flex items-center space-x-3">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-600">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-500/10 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  )}
                  <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div className="relative">
            <label htmlFor="destinationSearch" className="block text-sm font-medium text-gray-800 mb-2">
              Destination Name *
            </label>
            <div className="relative">
              <input
                type="text"
                id="destinationSearch"
                value={destinationSearch}
                onChange={handleSearchInputChange}
                onFocus={() => {
                  if (destinationSearch.length === 0 && destinations.length > 0) {
                    setFilteredDestinations(destinations)
                    setShowDropdown(true)
                  }
                }}
                required
                placeholder="Search destinations or click to see all..."
                className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                autoComplete="off"
              />
              
              {/* Loading indicator */}
              {isLoadingDestinations && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                </div>
              )}
              
              {/* Selected destination indicator */}
              {selectedDestination && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Dropdown with destinations */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white/90 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((destination) => (
                    <button
                      key={destination.destinasi_id}
                      type="button"
                      onClick={() => handleDestinationSelect(destination)}
                      className="w-full text-left px-4 py-3 hover:bg-emerald-500/10 transition-colors duration-200 border-b border-gray-200/20 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{destination.nama_destinasi}</span>
                        <span className="text-sm text-gray-600">ID: {destination.destinasi_id}</span>
                      </div>
                      {destination.category_name && (
                        <span className="text-xs text-gray-500 mt-1 block">{destination.category_name}</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-600 text-center">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {`No destinations found matching "${destinationSearch}"`}
                    <div className="text-xs mt-1">Try a different search term</div>
                  </div>
                )}
              </div>
            )}
            
            {/* Helper text */}
            <div className="mt-2 text-xs text-gray-600">
              {!selectedDestination && destinationSearch.length === 0 && (
                <span>Click the input field to see all destinations (1-37)</span>
              )}
              {selectedDestination && (
                <span className="text-green-600">✓ Selected: {selectedDestination.nama_destinasi} (ID: {selectedDestination.destinasi_id})</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Rating *
            </label>
            <div className="flex items-center space-x-4">
              <StarRating rating={rating} onRatingChange={setRating} />
              <span className="text-gray-600">
                {rating > 0 ? `${rating}/5 stars` : 'No rating selected'}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-800 mb-2">
              Review (Optional)
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              placeholder="Share your experience about this destination..."
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedDestination || rating === 0}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting Review...
              </div>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center ${
            message.includes('Error') 
              ? 'bg-red-500/20 border border-red-500/30 text-red-700' 
              : 'bg-green-500/20 border border-green-500/30 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <h3 className="font-semibold text-emerald-800 mb-2">Why Your Review Matters</h3>
          <p className="text-emerald-700 text-sm">
            Your reviews help train our machine learning model to provide better recommendations for you and other travelers. 
            Each rating contributes to improving the accuracy of our AI-powered suggestion system.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Review
