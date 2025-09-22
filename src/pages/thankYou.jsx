import { useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import CloudBackground from '../components/CloudBackground'
import profileImage from '../assets/profile.png'

const ThankYou = ({ submittedDestination, submittedRating }) => {
  const [user, setUser] = useState(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [])

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

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setShowProfileDropdown(false)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
    
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'login'}))
  }

  const handleBackToMainPage = () => {
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'landingpage'}))
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-2xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))
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
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h1>
            <p className="text-gray-700">Your review has been submitted successfully</p>
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

        {/* Success Content */}
        <div className="text-center py-8">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Thank You Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Thank you for your review!
          </h2>
          
          <p className="text-lg text-gray-700 mb-6 max-w-lg mx-auto">
            It'll make our recommendation model more better. Your feedback helps us provide 
            more accurate and personalized destination suggestions for you and other travelers.
          </p>

          {/* Review Summary */}
          {submittedDestination && (
            <div className="bg-emerald-50/80 border border-emerald-200/50 rounded-xl p-6 mb-8 max-w-md mx-auto">
              <h3 className="font-semibold text-emerald-800 mb-3">Your Review Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700">Destination:</span>
                  <span className="font-medium text-emerald-800">{submittedDestination}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700">Rating:</span>
                  <div className="flex space-x-1">
                    {renderStars(submittedRating)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Action Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleBackToMainPage}
              className="py-4 px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Return to Main Page</span>
            </button>
          </div>

          {/* Additional Review Section */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Have another review? Click below</p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', {detail: 'review'}))}
              className="py-3 px-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Write Another Review</span>
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>How Your Review Helps</span>
          </h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            Your review contributes to our machine learning model's training data, helping us understand 
            travel preferences better. This enables us to provide more accurate recommendations for 
            destinations that match your interests and improve the overall experience for all users.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ThankYou
