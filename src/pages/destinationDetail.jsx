import { useState, useEffect } from 'react'
import { destinationAPI } from '../services/api'
import CloudBackground from '../components/CloudBackground'

const DestinationDetail = ({ destinationId, onBack }) => {
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (destinationId) {
      fetchDestinationDetail()
    }
  }, [destinationId])

  const fetchDestinationDetail = async () => {
    try {
      setLoading(true)
      setError('') // Clear previous errors
      console.log('Fetching destination detail for ID:', destinationId)
      
      // Additional debugging
      console.log('API Base URL:', 'http://localhost:8080')
      console.log('Full API URL:', `http://localhost:8080/destinations/${destinationId}`)
      
      const response = await destinationAPI.getDestinationById(destinationId)
      console.log('Destination detail response:', response)
      setDestination(response)
    } catch (error) {
      console.error('Error fetching destination detail:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      // More specific error messages
      if (error.message.includes('Failed to fetch')) {
        setError('Unable to connect to server. Please check if the backend is running.')
      } else if (error.message.includes('404')) {
        setError(`Destination with ID ${destinationId} not found.`)
      } else if (error.message.includes('401') || error.message.includes('403')) {
        setError('You need to be logged in to view destination details.')
      } else {
        setError(`Failed to load destination details: ${error.message}`)
      }
      
      // Create a fallback destination object with basic info
      const fallbackDestination = {
        destinasi_id: destinationId,
        nama_destinasi: `Swiss Destination ${destinationId}`,
        kategori_id: 1,
        deskripsi: "This is a beautiful destination in Switzerland with stunning views and amazing experiences. Perfect for travelers looking to explore the natural beauty and cultural richness of Switzerland.",
        full_deskripsi: "Switzerland offers some of the most breathtaking landscapes in the world, with majestic mountains, pristine lakes, and charming villages. This destination provides visitors with an opportunity to experience the authentic Swiss culture, enjoy outdoor activities, and create unforgettable memories.\n\nWhether you're interested in hiking, photography, cultural exploration, or simply relaxing in nature, this location has something special to offer. The combination of natural beauty and Swiss hospitality makes it a perfect destination for travelers of all ages and interests.",
        image_url: null,
        category_name: "Unknown Category"
      }
      setDestination(fallbackDestination)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CloudBackground />
        <div className="text-center z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading destination details...</p>
        </div>
      </div>
    )
  }

  // Show error as notification but continue with fallback data if available
  const showErrorNotification = error && !destination

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CloudBackground />
        <div className="text-center z-10">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Destination Not Found</h2>
          <p className="text-gray-600 mb-6">The destination you're looking for doesn't exist.</p>
          <button
            onClick={onBack}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CloudBackground />
      
      {/* Error Notification */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span>⚠️</span>
            <span className="text-sm">Using fallback data: {error}</span>
          </div>
        </div>
      )}
      
      {/* Header with Back Button */}
      <div className="relative z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Recommendations</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Hero Image Section */}
          <div className="relative h-96 md:h-[500px]">
            <img
              src={destination.image_url || `https://source.unsplash.com/1200x600/?switzerland,${destination.nama_destinasi}`}
              alt={destination.nama_destinasi}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://source.unsplash.com/1200x600/?switzerland,mountains,destination`
              }}
            />
            <div className="absolute inset-0 bg-black/30"></div>
            
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                  {destination.nama_destinasi}
                </h1>
                {destination.category_name && (
                  <div className="inline-flex items-center bg-orange-500/80 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white font-semibold">{destination.category_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Main Description */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">About This Destination</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">
                    {destination.deskripsi || 'Discover the beauty and wonder of this amazing Swiss destination. Experience breathtaking views, rich culture, and unforgettable memories in one of Switzerland\'s most captivating locations.'}
                  </p>
                  
                  {/* Full Description Section */}
                  {destination.full_deskripsi && (
                    <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                        <span className="text-2xl mr-2">📖</span>
                        Detailed Information
                      </h3>
                      <div className="text-gray-700 leading-relaxed">
                        {destination.full_deskripsi.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 sticky top-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Info</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Destination ID</span>
                      <span className="text-gray-800 font-semibold">#{destination.destinasi_id}</span>
                    </div>
                    
                    {destination.kategori_id && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Category</span>
                        <span className="text-gray-800 font-semibold">{destination.category_name || `Category ${destination.kategori_id}`}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Location</span>
                      <span className="text-gray-800 font-semibold">Switzerland</span>
                    </div>
                    
                  </div>

                  {/* Back to Recommendations Button */}
                  <div className="mt-8">
                    <button 
                      onClick={onBack}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>Back to Recommendations</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationDetail
