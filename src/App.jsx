import { useState, useEffect } from 'react'
import Login from './pages/login'
import Signup from './pages/signup'
import Preference from './pages/preference'
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
