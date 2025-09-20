import { useState, useEffect } from 'react'
import { categoryAPI, userAPI, recommendationAPI } from '../services/api'
import CloudBackground from '../components/CloudBackground'

const Preference = () => {
  const [categories, setCategories] = useState([])
  const [selectedLabels, setSelectedLabels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryAPI.getCategories()
      setCategories(response || [])
    } catch (error) {
      setError(`Failed to load categories: ${error.message}`)
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLabelToggle = (label) => {
    setSelectedLabels(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    )
  }

  const handleContinue = async () => {
    if (selectedLabels.length === 0) {
      setError('Please select at least one preference')
      return
    }

    setSaving(true)
    setError('')

    try {
      // Convert selected labels to preferences with kategori_id
      const selectedPreferences = categories
        .filter(category => selectedLabels.includes(category.label))
        .map(category => ({
          kategori_id: category.kategori_id,
          weight: 1.0 // Default weight
        }))

      console.log('Saving preferences:', selectedPreferences)

      // Save preferences to backend
      const response = await userAPI.savePreferences(selectedPreferences)
      
      console.log('Preferences saved successfully:', response)
      
      // Show success message
      setError('')
      
      // Get recommendations based on saved preferences
      setLoadingRecommendations(true)
      try {
        const recommendationResponse = await recommendationAPI.getRecommendations(10)
        console.log('Recommendations received:', recommendationResponse)
        
        setRecommendations(recommendationResponse.recommendations || [])
        setShowRecommendations(true)
        
        // Show success message with recommendation info
        alert(`${response.message} Saved ${response.saved_count} preferences. Got ${recommendationResponse.recommendations?.length || 0} recommendations!`)
        
      } catch (recError) {
        console.error('Error getting recommendations:', recError)
        setError(`Preferences saved but failed to get recommendations: ${recError.message}`)
      } finally {
        setLoadingRecommendations(false)
      }
      
    } catch (error) {
      console.error('Error saving preferences:', error)
      setError(`Failed to save preferences: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleViewDashboard = () => {
    // Navigate to landing page after viewing recommendations
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'landingpage'}))
  }

  const handleLogout = () => {
    // Clear stored session
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
    
    // Navigate back to login page
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'login'}))
  }


  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <CloudBackground />
      
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-8 w-full max-w-2xl relative z-10">
        {/* Header with logout button */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">Choose Your Preferences</h1>
            <p className="text-gray-700">Select the categories that interest you most</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-700 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
            <span className="ml-3 text-gray-700">Loading categories...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/30 text-red-100 p-4 rounded-lg text-center mb-6">
            {error}
            <button 
              onClick={fetchCategories}
              className="block mx-auto mt-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category.kategori_id}
                  onClick={() => handleLabelToggle(category.label)}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-sm font-semibold min-h-[80px] flex items-center justify-center text-center overflow-hidden ${
                    selectedLabels.includes(category.label)
                      ? 'bg-gradient-to-br from-sky-400/40 to-teal-400/40 border-sky-400 text-sky-900 scale-105 shadow-lg shadow-sky-400/25'
                      : 'bg-white/15 border-white/30 text-gray-700 hover:bg-white/25 hover:border-white/50 hover:scale-102 hover:shadow-lg backdrop-blur-sm'
                  }`}
                >
                  {/* Background gradient overlay for selected state */}
                  {selectedLabels.includes(category.label) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-200/20 to-teal-200/20 rounded-xl"></div>
                  )}
                  
                  {/* Selection indicator */}
                  {selectedLabels.includes(category.label) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Category label */}
                  <span className="relative z-10 leading-tight">
                    {category.label}
                  </span>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </button>
              ))}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                No categories available
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                disabled={selectedLabels.length === 0 || saving}
                className="w-full max-w-md py-4 px-6 bg-gradient-to-r from-sky-400 to-teal-400 text-white font-medium rounded-xl hover:from-sky-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving preferences...
                  </div>
                ) : selectedLabels.length === 0 ? (
                  'Select at least one preference'
                ) : (
                  `Continue with ${selectedLabels.length} preference${selectedLabels.length > 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </>
        )}

        {selectedLabels.length > 0 && !showRecommendations && (
          <div className="mt-6 p-4 bg-sky-400/10 border border-sky-400/30 rounded-lg">
            <h3 className="text-sm font-medium text-sky-800 mb-2">Selected preferences:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedLabels.map((label) => (
                <span
                  key={label}
                  className="px-3 py-1 bg-sky-400/20 text-sky-800 text-xs rounded-full"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {showRecommendations && (
          <div className="mt-6 p-6 bg-gradient-to-br from-green-400/10 to-emerald-400/10 border border-green-400/30 rounded-xl">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-green-800 mb-2">🎯 Your Personalized Recommendations</h3>
              <p className="text-green-700 text-sm">Based on your selected preferences</p>
            </div>

            {loadingRecommendations ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                <span className="ml-3 text-green-700">Getting your recommendations...</span>
              </div>
            ) : recommendations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {recommendations.slice(0, 6).map((rec, index) => (
                    <div 
                      key={rec.destinasi_id}
                      className="p-3 bg-white/20 border border-green-400/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-green-800">Destination #{rec.destinasi_id}</h4>
                          <p className="text-sm text-green-600">Match Score: {(rec.score * 100).toFixed(1)}%</p>
                        </div>
                        <span className="text-lg font-bold text-green-700">#{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {recommendations.length > 6 && (
                  <p className="text-center text-green-600 text-sm mb-4">
                    + {recommendations.length - 6} more recommendations available
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleViewDashboard}
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-medium rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    View Full Dashboard
                  </button>
                  
                  <button
                    onClick={() => setShowRecommendations(false)}
                    className="px-6 py-3 bg-white/20 border border-green-400/30 text-green-700 font-medium rounded-lg hover:bg-white/30 transition-all duration-200"
                  >
                    Back to Preferences
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-green-600 mb-4">No recommendations available at the moment.</p>
                <button
                  onClick={handleViewDashboard}
                  className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-medium rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-200"
                >
                  Continue to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Preference
