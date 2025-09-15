// API service for backend communication

const API_BASE_URL = 'http://localhost:8080'

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
}

export default { authAPI }
