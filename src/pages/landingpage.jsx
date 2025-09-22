import { useState, useEffect } from 'react'
import { userAPI, authAPI, recommendationAPI, destinationAPI } from '../services/api'
import profileImage from '../assets/profile.png'
import swissLogo from '../assets/swiss.png'
import gambar1 from '../assets/gambar1.webp'
import gambar2 from '../assets/gambar2.webp'
import gambar3 from '../assets/gambar3.webp'
import DestinationDetail from './destinationDetail'

const LandingPage = () => {
  const [user, setUser] = useState(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [recommendations, setRecommendations] = useState([])
  const [destinationDetails, setDestinationDetails] = useState({})
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)
  const [displayCount, setDisplayCount] = useState(9) // Start with 9 recommendations, then show more
  const [hoveredDestination, setHoveredDestination] = useState(null)
  const [hasClickedShowMore, setHasClickedShowMore] = useState(false) // Track if user has clicked show more
  const [typewriterText, setTypewriterText] = useState('') // For typewriter animation
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [selectedDestinationId, setSelectedDestinationId] = useState(null) // For destination detail view
  const [isDarkMode] = useState(true) // Static dark mode

  const heroImages = [gambar1, gambar2, gambar3]

  useEffect(() => {
    fetchUserProfile()
    fetchRecommendations()
  }, [])

  // Typewriter animation effect
  useEffect(() => {
    const fullText = `Hi, ${user?.name || 'Traveler'}! Experience the most beautiful destinations in Switzerland with AI-powered recommendations tailored just for you.`
    let currentIndex = 0
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypewriterText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        setIsTypingComplete(true)
        clearInterval(typeInterval)
      }
    }, 50) // Typing speed: 50ms per character

    return () => clearInterval(typeInterval)
  }, [user?.name]) // Re-run when user name changes

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true)
      const response = await recommendationAPI.getRecommendations() // Get all available recommendations
      console.log('[DEBUG] Full recommendation response:', response)
      console.log('[DEBUG] Number of recommendations received:', response.recommendations?.length || 0)
      console.log('[DEBUG] Recommendation type:', response.recommendation_type)
      setRecommendations(response.recommendations || [])
      
      // Fetch destination details for recommendations
      if (response.recommendations && response.recommendations.length > 0) {
        await fetchDestinationDetails(response.recommendations)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setRecommendations([])
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const fetchAllRecommendations = async () => {
    try {
      setLoadingRecommendations(true)
      // Use cold start with all categories to get all destinations
      const allCategories = [1, 2, 3, 4, 5, 6, 7] // All available categories
      const response = await recommendationAPI.getColdStartRecommendations(allCategories)
      console.log('[DEBUG] All destinations response:', response)
      console.log('[DEBUG] Number of all destinations received:', response.recommendations?.length || 0)
      setRecommendations(response.recommendations || [])
      setDisplayCount(9) // Reset display count
      
      // Fetch destination details for recommendations
      if (response.recommendations && response.recommendations.length > 0) {
        await fetchDestinationDetails(response.recommendations)
      }
    } catch (error) {
      console.error('Error fetching all recommendations:', error)
      // Fallback to regular recommendations
      await fetchRecommendations()
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const fetchDestinationDetails = async (recs) => {
    try {
      const destinationIds = recs.map(rec => rec.destinasi_id)
      console.log('Fetching destination details for IDs:', destinationIds)
      
      const destinationsResponse = await destinationAPI.getDestinationsByIds(destinationIds)
      console.log('Destination API response:', destinationsResponse)
      
      if (destinationsResponse && destinationsResponse.length > 0) {
        const details = {}
        destinationsResponse.forEach((dest, index) => {
          details[dest.destinasi_id] = {
            nama_destinasi: dest.nama_destinasi,
            deskripsi: dest.deskripsi,
            kategori_id: dest.kategori_id,
            category_name: dest.category_name,
            image_url: dest.image_url || `https://source.unsplash.com/400x300/?switzerland,mountains,${index}` // Fallback to Unsplash if no image_url
          }
        })
        console.log('Setting destination details:', details)
        setDestinationDetails(details)
      } else {
        console.warn('No destination details received, using fallback data')
        // Use fallback data
        const mockDetails = {}
        recs.forEach((rec, index) => {
        mockDetails[rec.destinasi_id] = {
          nama_destinasi: `Swiss Destination ${rec.destinasi_id}`,
          deskripsi: `This is a beautiful destination in Switzerland with breathtaking views and amazing experiences. Perfect for adventure seekers and nature lovers.`,
          image_url: `https://source.unsplash.com/400x300/?switzerland,mountains,${index}` // Fallback image
        }
        })
        setDestinationDetails(mockDetails)
      }
    } catch (error) {
      console.error('Error fetching destination details:', error)
      console.error('Error details:', error.message, error.stack)
      // Fallback to mock data if API fails
      const mockDetails = {}
      recs.forEach((rec, index) => {
        mockDetails[rec.destinasi_id] = {
          nama_destinasi: `Swiss Destination ${rec.destinasi_id}`,
          deskripsi: `This is a beautiful destination in Switzerland with breathtaking views and amazing experiences. Perfect for adventure seekers and nature lovers.`,
          image_url: `https://source.unsplash.com/400x300/?switzerland,mountains,${index}` // Fallback image
        }
      })
      setDestinationDetails(mockDetails)
    }
  }

  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

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


  const handleNavigateToReviews = () => {
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'review'}))
  }

  const handleDestinationClick = (destinationId) => {
    console.log('Opening destination detail for ID:', destinationId)
    setSelectedDestinationId(destinationId)
  }

  const handleBackToRecommendations = () => {
    setSelectedDestinationId(null)
  }

  // Apply dark mode class on component mount (static dark mode)
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setShowProfileDropdown(false)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
    
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'login'}))
  }

  // Show destination detail if a destination is selected
  if (selectedDestinationId) {
    return (
      <DestinationDetail 
        destinationId={selectedDestinationId}
        onBack={handleBackToRecommendations}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-800 font-medium">Logging out...</p>
            <p className="text-gray-600 text-sm mt-1">Please wait</p>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <nav className="absolute top-0 w-full z-30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <img src={swissLogo} alt="Swiss Logo" className="h-20 w-auto" />
                <h1 className="text-2xl font-bold text-white">Swisstination</h1>
              </div>
              <div className="hidden md:flex space-x-6">
                <button 
                  onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })}
                  className="text-white hover:text-orange-400 transition-colors"
                >
                  HOME
                </button>
                <button 
                  onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                  className="text-white hover:text-orange-400 transition-colors"
                >
                  ABOUT
                </button>
                <button 
                  onClick={() => document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' })}
                  className="text-white hover:text-orange-400 transition-colors"
                >
                  DESTINATIONS
                </button>
                <button 
                  onClick={() => document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' })}
                  className="text-white hover:text-orange-400 transition-colors"
                >
                  REVIEWS
                </button>
              </div>
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="p-1 hover:bg-white/20 rounded-full transition-all duration-200"
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/50 hover:border-white transition-all duration-200"
                />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50">
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
        </div>
      </nav>

      {/* Hero Section with Rotating Images */}
      <section id="home" className="relative h-screen overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              DISCOVER SWITZERLAND
            </h1>
            <div className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto min-h-[120px] flex items-center justify-center">
              <p className="relative">
                {typewriterText}
                {!isTypingComplete && (
                  <span className="inline-block w-0.5 h-6 bg-white ml-1 animate-pulse">|</span>
                )}
              </p>
            </div>
            <div className={`transition-opacity duration-1000 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
              <button 
                onClick={() => document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' })}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                EXPLORE DESTINATIONS
              </button>
            </div>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">What is Swisstination?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your intelligent travel companion powered by advanced AI technology, designed to discover the perfect Swiss destinations based on your unique preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-300">Advanced machine learning algorithms analyze your preferences to deliver personalized recommendations.</p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🏔️</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Swiss Focus</h3>
              <p className="text-gray-600 dark:text-gray-300">Specialized in Switzerland's most breathtaking destinations and hidden gems.</p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Personalized</h3>
              <p className="text-gray-600 dark:text-gray-300">Every recommendation is tailored to match your travel style and interests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section id="destinations" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">YOUR PERSONALIZED RECOMMENDATIONS</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Discover destinations perfectly matched to your preferences</p>
          </div>
          
          {loadingRecommendations ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
              <span className="ml-4 text-2xl text-gray-600 dark:text-gray-300">Loading your recommendations...</span>
            </div>
          ) : recommendations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.slice(0, displayCount).map((rec, index) => {
                  const details = destinationDetails[rec.destinasi_id] || {}
                  return (
                    <div
                      key={rec.destinasi_id}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
                      onMouseEnter={() => setHoveredDestination(rec.destinasi_id)}
                      onMouseLeave={() => setHoveredDestination(null)}
                    >
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={details.image_url || `https://source.unsplash.com/400x300/?switzerland,mountains,${index}`}
                          alt={details.nama_destinasi || `Destination ${rec.destinasi_id}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            // Fallback to Unsplash if Supabase image fails to load
                            e.target.src = `https://source.unsplash.com/400x300/?switzerland,mountains,${index}`
                          }}
                          loading="lazy"
                        />
                        

                        {/* Hover Overlay with Description */}
                        <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm flex items-end transition-all duration-500 ${
                          hoveredDestination === rec.destinasi_id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}>
                          <div className="p-6 text-white transform transition-transform duration-500">
                            <h4 className="text-lg font-bold mb-2">
                              {details.nama_destinasi || `Destination ${rec.destinasi_id}`}
                            </h4>
                            <p className="text-sm leading-relaxed">
                              {details.deskripsi || 'Beautiful Swiss destination with amazing views and experiences.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                          {details.nama_destinasi || `Swiss Destination ${rec.destinasi_id}`}
                        </h3>
                        
                        <button 
                          onClick={() => handleDestinationClick(rec.destinasi_id)}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          EXPLORE DESTINATION
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Show More Button */}
              {displayCount < recommendations.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => {
                      const nextCount = Math.min(displayCount + 9, recommendations.length)
                      setDisplayCount(nextCount)
                      setHasClickedShowMore(true) // Mark that user has clicked show more
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    SHOW MORE DESTINATIONS ({Math.min(9, recommendations.length - displayCount)} more)
                  </button>
                </div>
              )}

              {/* Total Count Display */}
              <div className="text-center mt-8">
                <p className="text-gray-600 dark:text-gray-300">
                  Showing {Math.min(displayCount, recommendations.length)} of {recommendations.length} recommendations
                </p>
                {recommendations.length < 37 && hasClickedShowMore && displayCount >= recommendations.length && (
                  <div className="mt-6">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium">
                      Tidak menemukan yang sesuai? Cek lebih banyak destinasi lainnya.
                    </p>
                    <button
                      onClick={fetchAllRecommendations}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                    >
                      LIHAT LEBIH BANYAK
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No Recommendations Available</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Complete your preferences to get personalized destination recommendations</p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', {detail: 'preference'}))}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                SET PREFERENCES
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">SHARE YOUR EXPERIENCE</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Help us improve our AI recommendations by sharing your travel experiences. Your reviews make our suggestions even better!
          </p>
          <button
            onClick={handleNavigateToReviews}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            WRITE A REVIEW
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-3xl font-bold mb-4">Swisstination</h3>
              <p className="text-gray-400">Discover Switzerland with AI-powered personalized recommendations.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#destinations" className="hover:text-white transition-colors">Destinations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Travel Planning</a></li>
                <li><a href="#reviews" className="hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@swisstination.com</li>
                <li>Phone: +41 XX XXX XX XX</li>
                <li>Switzerland</li>
              </ul>
            </div>
          </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2025 Swisstination. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage