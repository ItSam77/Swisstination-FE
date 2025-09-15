import { useState } from 'react'
import { authAPI } from '../services/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await authAPI.login(email, password)
      setMessage(response.message)
      console.log('User logged in:', response.user)
      
      // Store user session if needed
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
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <p className="auth-link">
          Don't have an account? <button 
            type="button" 
            style={{background: 'none', border: 'none', color: '#667eea', textDecoration: 'underline', cursor: 'pointer'}}
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', {detail: 'signup'}))}
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
