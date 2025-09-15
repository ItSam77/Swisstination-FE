import { useState } from 'react'
import { authAPI } from '../services/api'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await authAPI.signup(name, email, password)
      setMessage(response.message)
      console.log('User signed up:', response.user)
      
      // Clear form on success
      setName('')
      setEmail('')
      setPassword('')
      
      // Store user session if provided
      if (response.session) {
        localStorage.setItem('userSession', JSON.stringify(response.session))
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <p className="auth-link">
          Already have an account? <button 
            type="button" 
            style={{background: 'none', border: 'none', color: '#667eea', textDecoration: 'underline', cursor: 'pointer'}}
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', {detail: 'login'}))}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  )
}

export default Signup
