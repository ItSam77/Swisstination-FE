import { useState, useEffect } from 'react'
import Login from './pages/login'
import Signup from './pages/signup'
import Preference from './pages/preference'
import { authAPI } from './services/api'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if we have stored session with token
        const localSession = localStorage.getItem('userSession')
        const sessionSession = sessionStorage.getItem('userSession')
        
        const session = localSession || sessionSession
        
        if (session) {
          const parsedSession = JSON.parse(session)
          
          // If we have an access_token, verify it with backend
          if (parsedSession && parsedSession.access_token) {
            try {
              const response = await authAPI.verifyToken()
              
              if (response.valid) {
                // Token is valid, redirect to preference
                setCurrentPage('preference')
              } else {
                // Token is invalid, clear storage and stay on login
                localStorage.removeItem('userSession')
                sessionStorage.removeItem('userSession')
              }
            } catch (error) {
              // Token verification failed, clear storage and stay on login
              console.error('Token verification failed:', error)
              localStorage.removeItem('userSession')
              sessionStorage.removeItem('userSession')
            }
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        // If there's an error, clear storage and stay on login page
        localStorage.removeItem('userSession')
        sessionStorage.removeItem('userSession')
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuthentication()
  }, [])

  useEffect(() => {
    const handleNavigation = (event) => {
      setCurrentPage(event.detail)
    }

    window.addEventListener('navigate', handleNavigation)
    return () => window.removeEventListener('navigate', handleNavigation)
  }, [])

  const renderPage = () => {
    // Show loading screen while checking authentication
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-teal-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    switch (currentPage) {
      case 'login':
        return <Login />
      case 'signup':
        return <Signup />
      case 'preference':
        return <Preference />
      default:
        return <Login />
    }
  }

  return (
    <>
      {renderPage()}
    </>
  )
}

export default App
