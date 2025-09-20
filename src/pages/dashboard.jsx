import { useState, useEffect } from 'react'
import { userAPI } from '../services/api'
import CloudBackground from '../components/CloudBackground'

const Dashboard = () => {
  const [preferences, setPreferences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserPreferences()
  }, [])

  const fetchUserPreferences = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getPreferences()
      setPreferences(response.preferences || [])
    } catch (error) {
      setError(`Failed to load preferences: ${error.message}`)
      console.error('Error fetching preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear stored session
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
    
    // Navigate back to login page
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'login'}))
  }

  const handleEditPreferences = () => {
    // Navigate back to preference page
    window.dispatchEvent(new CustomEvent('navigate', {detail: 'preference'}))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <CloudBackground />
      
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-8 w-full max-w-4xl relative z-10">
        {/* Header with logout button */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-700">Welcome to your personalized experience</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-700 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            Logout
          </button>
        </div>

        {/* Preferences Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Preferences</h2>
            <button
              onClick={handleEditPreferences}
              className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-700 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              Edit Preferences
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
              <span className="ml-3 text-gray-700">Loading preferences...</span>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/30 text-red-100 p-4 rounded-lg text-center mb-6">
              {error}
              <button 
                onClick={fetchUserPreferences}
                className="block mx-auto mt-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : preferences.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {preferences.map((pref) => (
                <div
                  key={pref.kategori_id}
                  className="p-4 bg-white/15 border border-white/30 rounded-lg backdrop-blur-sm"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {pref.category?.label || `Category ${pref.kategori_id}`}
                  </h3>
                  <div className="text-sm text-gray-600">
                    Weight: {pref.weight}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No preferences set yet</p>
              <button
                onClick={handleEditPreferences}
                className="px-6 py-3 bg-gradient-to-r from-sky-400 to-teal-400 text-white font-medium rounded-lg hover:from-sky-500 hover:to-teal-500 transition-all duration-200"
              >
                Set Your Preferences
              </button>
            </div>
          )}
        </div>

        {/* Future sections can be added here */}
        <div className="border-t border-white/20 pt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h2>
          <div className="text-center py-8 text-gray-600">
            <p>Personalized recommendations based on your preferences will appear here soon!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
