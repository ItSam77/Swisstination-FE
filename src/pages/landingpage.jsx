import { useState, useEffect } from 'react'
import { userAPI, authAPI, recommendationAPI } from '../services/api'
import profileImage from '../assets/profile.png'
import swissLogo from '../assets/swiss.png'
import gambar1 from '../assets/gambar1.webp'
import gambar2 from '../assets/gambar2.webp'
import gambar3 from '../assets/gambar3.webp'

const LandingPage = () => {
  const [user, setUser] = useState(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [topRecommendations, setTopRecommendations] = useState([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = [gambar1, gambar2, gambar3]

  useEffect(() => {
    fetchUserProfile()
    fetchTopRecommendations()
  }, [])

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

  const fetchTopRecommendations = async () => {
    try {
      setLoadingRecommendations(true)
      const response = await recommendationAPI.getRecommendations(6) // Get top 6
      setTopRecommendations(response.recommendations || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setTopRecommendations([])
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const handleNavigateToReviews = () => {
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'review'}))
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setShowProfileDropdown(false)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
    
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'login'}))
  }

  return (
    <div className="min-h-screen bg-white">
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
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Hi, {user?.name || 'Traveler'}! Experience the most beautiful destinations in Switzerland with AI-powered recommendations tailored just for you.
            </p>
            <button 
              onClick={() => document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' })}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 transform hover:scale-105"
            >
              EXPLORE DESTINATIONS
            </button>
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
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">What is Swisstination?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your intelligent travel companion powered by advanced AI technology, designed to discover the perfect Swiss destinations based on your unique preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">AI-Powered</h3>
              <p className="text-gray-600">Advanced machine learning algorithms analyze your preferences to deliver personalized recommendations.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl mb-4">🏔️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Swiss Focus</h3>
              <p className="text-gray-600">Specialized in Switzerland's most breathtaking destinations and hidden gems.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Personalized</h3>
              <p className="text-gray-600">Every recommendation is tailored to match your travel style and interests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Destinations Section */}
      <section id="destinations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">YOUR TOP RECOMMENDATIONS</h2>
            <p className="text-xl text-gray-600">Discover destinations perfectly matched to your preferences</p>
          </div>
          
          {loadingRecommendations ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <span className="ml-4 text-xl text-gray-600">Loading your recommendations...</span>
            </div>
          ) : topRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topRecommendations.map((rec, index) => (
                <div
                  key={rec.destinasi_id}
                  className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-6xl">🏔️</span>
                    <div className="absolute top-4 right-4 bg-orange-500 text-white rounded-full px-3 py-1 text-sm font-bold">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Destination #{rec.destinasi_id}</h3>
                    <p className="text-orange-500 font-semibold mb-2">Match Score: {(rec.score * 100).toFixed(1)}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${rec.score * 100}%` }}
                      ></div>
                    </div>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors duration-300">
                      EXPLORE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Recommendations Yet</h3>
              <p className="text-gray-600">Complete your preferences to get personalized destination recommendations</p>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">SHARE YOUR EXPERIENCE</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
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
      <footer className="bg-gray-800 text-white py-8">
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