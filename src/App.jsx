import { useState, useEffect } from 'react'
import Login from './pages/login'
import Signup from './pages/signup'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')

  useEffect(() => {
    const handleNavigation = (event) => {
      setCurrentPage(event.detail)
    }

    window.addEventListener('navigate', handleNavigation)
    return () => window.removeEventListener('navigate', handleNavigation)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login />
      case 'signup':
        return <Signup />
      case 'test':
        return <ApiTest />
      default:
        return <Login />
    }
  }

  return (
    <>
      <div className="nav-container">
        <button 
          className={`nav-button ${currentPage === 'login' ? 'active' : ''}`}
          onClick={() => setCurrentPage('login')}
        >
          Login
        </button>
        <button 
          className={`nav-button ${currentPage === 'signup' ? 'active' : ''}`}
          onClick={() => setCurrentPage('signup')}
        >
          Sign Up
        </button>
      </div>
      
      {renderPage()}
    </>
  )
}

export default App
