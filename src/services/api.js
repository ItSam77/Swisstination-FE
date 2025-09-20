// API service for backend communication

const API_BASE_URL = 'http://localhost:8080'

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
  // Get personalized recommendations based on user preferences
  getRecommendations: async (n = 10) => {
    return makeRequest(`/recommendations?n=${n}`)
  },

  // Get recommendations for a specific category
  getRecommendationsByCategory: async (categoryId, n = 10) => {
    return makeRequest(`/recommendations/categories/${categoryId}?n=${n}`)
  },

  // Get cold start recommendations for specific categories (for testing)
  getColdStartRecommendations: async (categoryIds, n = 10) => {
    return makeRequest(`/recommendations/cold-start?n=${n}`, {
      method: 'POST',
      body: JSON.stringify(categoryIds),
    })
  },
}

export default { authAPI, categoryAPI, userAPI, recommendationAPI }
