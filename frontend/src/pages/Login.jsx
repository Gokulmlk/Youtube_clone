import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiVideoCamera } from 'react-icons/hi'
import { loginUser, clearError } from '../store/slices/authSlice'
import { toast } from 'react-toastify'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, user } = useSelector(s => s.auth)
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (user) navigate(from, { replace: true })
    return () => dispatch(clearError())
  }, [user, navigate, from, dispatch])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-red-600 rounded px-1 py-0.5">
            <HiVideoCamera className="text-white text-2xl" />
          </div>
          <span className="text-white font-bold text-2xl">YouTube</span>
        </div>

        <div className="bg-[#212121] rounded-2xl p-8 border border-[#3d3d3d]">
          <h1 className="text-white text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-[#aaa] text-sm mb-6">to continue to YouTube</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-3 py-2 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[#aaa] text-xs font-medium mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full bg-[#121212] border border-[#3d3d3d] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555] transition-colors"
              />
            </div>
            <div>
              <label className="text-[#aaa] text-xs font-medium mb-1 block">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full bg-[#121212] border border-[#3d3d3d] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#3d3d3d] text-center">
            <p className="text-[#aaa] text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Create account
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 bg-[#1a1a1a] rounded-lg p-3 text-xs text-[#aaa]">
            <p className="font-semibold text-white mb-1">Demo credentials:</p>
            <p>john@example.com / Password123</p>
            <p>jane@example.com / Password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}