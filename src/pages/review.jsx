import { useState, useEffect } from 'react'
import { authAPI, destinationAPI } from '../services/api'
import CloudBackground from '../components/CloudBackground'
import profileImage from '../assets/profile.png'

const Review = () => {
  const [user, setUser] = useState(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [destinationId, setDestinationId] = useState('')
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [destinations, setDestinations] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchUserProfile()
    fetchDestinations()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false)
      }
      if (!event.target.closest('.destination-search')) {
        setShowDestinationDropdown(false)
      }
    }

    if (showProfileDropdown || showDestinationDropdown) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showProfileDropdown, showDestinationDropdown])

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getCurrentUser()
      setUser(response.user)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchDestinations = async () => {
    try {
      setIsLoadingDestinations(true)
      console.log('Fetching destinations...')
      const response = await destinationAPI.getAllDestinations()
      console.log('Destinations response:', response)
      const destinationsList = response.destinations || []
      console.log('Destinations list:', destinationsList)
      setDestinations(destinationsList)
    } catch (error) {
      console.error('Error fetching destinations:', error)
      // Fallback data for testing if API fails
      const fallbackDestinations = [
        { destinasi_id: "1", nama_destinasi: "Zermatt & Matterhorn (Valais)", category_name: "Natural Attractions" },
        { destinasi_id: "2", nama_destinasi: "Lauterbrunnen", category_name: "Natural Attractions" },
        { destinasi_id: "3", nama_destinasi: "Grindelwald & First/Schreckhorn", category_name: "Natural Attractions" },
        { destinasi_id: "7", nama_destinasi: "Lake Geneva (Montreux & Vevey)", category_name: "Natural Attractions" },
        { destinasi_id: "11", nama_destinasi: "Zürich", category_name: "Cities" },
        { destinasi_id: "12", nama_destinasi: "Genève (Geneva)", category_name: "Cities" },
        { destinasi_id: "14", nama_destinasi: "Bern", category_name: "Cities" },
        { destinasi_id: "17", nama_destinasi: "Château de Chillon (Montreux)", category_name: "Cultural Sites" },
        { destinasi_id: "27", nama_destinasi: "Zermatt (Ski & Glacier Paradise)", category_name: "Adventure Sports" },
        { destinasi_id: "33", nama_destinasi: "Montreux Jazz Festival", category_name: "Events & Festivals" }
      ]
      console.log('Using fallback data:', fallbackDestinations)
      setDestinations(fallbackDestinations)
      setMessage('Using sample data (API connection failed)')
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

  // Filter destinations based on search query
  const filteredDestinations = destinations.filter(dest => {
    if (searchQuery.length < 3) {
      return true // Show all if less than 3 characters
    }
    const query = searchQuery.toLowerCase()
    return dest.nama_destinasi.toLowerCase().includes(query) ||
           dest.destinasi_id.toString().toLowerCase().includes(query) ||
           (dest.category_name && dest.category_name.toLowerCase().includes(query))
  })

  const handleDestinationSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowDestinationDropdown(true)
  }

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination)
    setDestinationId(destination.destinasi_id)
    setSearchQuery(destination.nama_destinasi)
    setShowDestinationDropdown(false)
  }

  const handleSearchInputFocus = () => {
    console.log('Input focused, showing dropdown')
    console.log('Destinations:', destinations)
    console.log('filteredDestinations:', filteredDestinations)
    setShowDestinationDropdown(true)
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
      // TODO: Add API call to save review to ratings table
      // const response = await reviewAPI.submitReview({
      //   destination_id: selectedDestination.destinasi_id,
      //   rating: rating,
      //   review: review
      // })

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Store success message for thank you page
      sessionStorage.setItem('reviewSuccess', JSON.stringify({
        destinationName: selectedDestination.nama_destinasi,
        categoryName: selectedDestination.category_name,
        rating: rating
      }))
      
      // Redirect to thank you page
      window.dispatchEvent(new CustomEvent('navigate', {detail: 'thankYou'}))
      
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
          <div className="destination-search relative">
            <label htmlFor="destinationSearch" className="block text-sm font-medium text-gray-800 mb-2">
              Select Destination *
            </label>
            <div className="relative">
              <input
                type="text"
                id="destinationSearch"
                value={searchQuery}
                onChange={handleDestinationSearch}
                onFocus={handleSearchInputFocus}
                required
                placeholder={isLoadingDestinations ? "Loading destinations..." : "Search for a destination..."}
                disabled={isLoadingDestinations}
                className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 disabled:opacity-50"
              />
              
              {/* Search Icon */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isLoadingDestinations ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400"></div>
                ) : (
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>

              {/* Dropdown */}
              {showDestinationDropdown && !isLoadingDestinations && (
                <div className="absolute z-50 w-full mt-1 bg-white border-2 border-emerald-400 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {filteredDestinations.length > 0 ? (
                    <>
                      {searchQuery.length < 3 && (
                        <div className="px-4 py-2 text-sm text-gray-600 bg-blue-50/50 border-b border-gray-200/50">
                          {destinations.length} destinations available. Type 3+ characters to search.
                        </div>
                      )}
                      {filteredDestinations.map((destination) => (
                        <button
                          key={destination.destinasi_id}
                          type="button"
                          onClick={() => handleDestinationSelect(destination)}
                          className="w-full text-left px-4 py-3 hover:bg-emerald-500/10 transition-colors duration-200 border-b border-gray-200/30 last:border-b-0"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{destination.nama_destinasi}</p>
                            </div>
                            {destination.category_name && (
                              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                                {destination.category_name}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-600 text-center">
                      {searchQuery.length >= 3 ? 'No destinations found matching your search.' : 'Start typing to search destinations...'}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Selected Destination Preview */}
            {selectedDestination && (
              <div className="mt-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-emerald-800">Selected: {selectedDestination.nama_destinasi}</p>
                  {selectedDestination.category_name && (
                    <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                      {selectedDestination.category_name}
                    </span>
                  )}
                </div>
              </div>
            )}
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
