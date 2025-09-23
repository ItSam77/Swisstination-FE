// API service for backend communication

const API_BASE_URL = 'http://localhost:8001'

// Helper function to get stored token
const getStoredToken = () => {
  try {
    const localSession = localStorage.getItem('userSession')
    const sessionSession = sessionStorage.getItem('userSession')
    
    const session = localSession || sessionSession
    
    if (session) {
      const parsedSession = JSON.parse(session)
      return parsedSession.access_token
    }
    
    return null
  } catch (error) {
    console.error('Error getting stored token:', error)
    return null
  }
}

// Helper function to make API requests
const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add Authorization header if token exists and not already provided
  const token = getStoredToken()
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.detail || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Authentication API calls
export const authAPI = {
  // Sign up a new user
  signup: async (name, email, password) => {
    return makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
  },

  // Login user
  login: async (email, password) => {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })
  },

  // Logout user
  logout: async () => {
    return makeRequest('/auth/logout', {
      method: 'POST',
    })
  },

  // Get current user
  getCurrentUser: async () => {
    return makeRequest('/auth/user')
  },

  // Verify token
  verifyToken: async () => {
    return makeRequest('/auth/verify')
  },
}

// Category API calls
export const categoryAPI = {
  // Get all categories with labels
  getCategories: async () => {
    return makeRequest('/categories')
  },
}

// User API calls
export const userAPI = {
  // Save user preferences
  savePreferences: async (preferences) => {
    return makeRequest('/users/preferences', {
      method: 'POST',
      body: JSON.stringify({
        preferences: preferences
      }),
    })
  },

  // Get user preferences
  getPreferences: async () => {
    return makeRequest('/users/preferences')
  },

  // Check if user has preferences set
  checkPreferencesStatus: async () => {
    return makeRequest('/users/preferences/status')
  },
}

// Recommendation API calls
export const recommendationAPI = {
  // Get personalized recommendations based on user preferences (all available by default)
  getRecommendations: async (n = null) => {
    const url = n ? `/recommendations?n=${n}` : '/recommendations'
    return makeRequest(url)
  },

  // Get recommendations for a specific category (all available by default)
  getRecommendationsByCategory: async (categoryId, n = null) => {
    const url = n ? `/recommendations/categories/${categoryId}?n=${n}` : `/recommendations/categories/${categoryId}`
    return makeRequest(url)
  },

  // Get cold start recommendations for specific categories (all available by default)
  getColdStartRecommendations: async (categoryIds, n = null) => {
    const url = n ? `/recommendations/cold-start?n=${n}` : '/recommendations/cold-start'
    return makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(categoryIds),
    })
  },
}

// Destination API calls
export const destinationAPI = {
  // Get all destinations
  getAllDestinations: async () => {
    return makeRequest('/destinations')
  },

  // Get destination by ID
  getDestinationById: async (destinationId) => {
    return makeRequest(`/destinations/${destinationId}`)
  },

  // Get multiple destinations by IDs
  getDestinationsByIds: async (destinationIds) => {
    return makeRequest('/destinations/batch', {
      method: 'POST',
      body: JSON.stringify(destinationIds),
    })
  },
}

// Review API calls
export const reviewAPI = {
  // Submit a review and rating for a destination
  submitReview: async (reviewData) => {
    return makeRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    })
  },

  // Get all reviews submitted by current user
  getUserReviews: async () => {
    return makeRequest('/reviews/user')
  },
}

export default { authAPI, categoryAPI, userAPI, recommendationAPI, destinationAPI, reviewAPI }
