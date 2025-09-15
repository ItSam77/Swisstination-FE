import { useState } from 'react'
import { authAPI } from '../services/api'
import CloudBackground from '../components/CloudBackground'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
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
      
      // Store user session
      if (response.session) {
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem('userSession', JSON.stringify(response.session))
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <CloudBackground />
      
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-700">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-sky-400 bg-white/10 border-white/30 rounded focus:ring-sky-400 focus:ring-2"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-sky-400 to-teal-400 text-white font-medium rounded-lg hover:from-sky-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
            message.includes('Error') 
              ? 'bg-red-500/20 border border-red-500/30 text-red-100' 
              : 'bg-green-500/20 border border-green-500/30 text-green-100'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', {detail: 'signup'}))}
              className="text-sky-600 hover:text-sky-800 font-medium hover:underline transition-all duration-200"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
