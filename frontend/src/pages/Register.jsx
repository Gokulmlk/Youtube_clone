import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiVideoCamera } from 'react-icons/hi'
import { registerUser, clearError } from '../store/slices/authSlice'
import { toast } from 'react-toastify'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector(s => s.auth)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
    return () => dispatch(clearError())
  }, [user, navigate, dispatch])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Welcome!')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-red-600 rounded px-1 py-0.5">
            <HiVideoCamera className="text-white text-2xl" />
          </div>
          <span className="text-white font-bold text-2xl">YouTube</span>
        </div>

        <div className="bg-[#212121] rounded-2xl p-8 border border-[#3d3d3d]">
          <h1 className="text-white text-2xl font-bold mb-1">Create account</h1>
          <p className="text-[#aaa] text-sm mb-6">to continue to YouTube</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-3 py-2 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[#aaa] text-xs font-medium mb-1 block">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="Choose a username"
                className="w-full bg-[#121212] border border-[#3d3d3d] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555] transition-colors"
              />
            </div>
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
                minLength={6}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#121212] border border-[#3d3d3d] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555] transition-colors"
              />
              <p className="text-[#aaa] text-xs mt-1">Must include uppercase, lowercase and number</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#3d3d3d] text-center">
            <p className="text-[#aaa] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}