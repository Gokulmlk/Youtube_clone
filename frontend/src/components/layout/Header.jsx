import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiMenu, HiSearch, HiVideoCamera, HiBell, HiUser } from 'react-icons/hi'
import { MdVideoCall } from 'react-icons/md'
import { logout } from '../../store/slices/authSlice'
import { useTheme } from '../../context/ThemeContext'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { toggleSidebar } = useTheme()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f] flex items-center justify-between px-4 h-14">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-[#272727]">
          <HiMenu className="text-white text-xl" />
        </button>
        <Link to="/" className="flex items-center gap-1">
          <div className="bg-red-600 rounded px-1 py-0.5">
            <HiVideoCamera className="text-white text-xl" />
          </div>
          <span className="text-white font-bold text-xl hidden sm:block">YouTube</span>
        </Link>
      </div>

      {/* Center - Search */}
      <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-xl mx-4">
        <div className="flex flex-1 border border-[#303030] rounded-l-full overflow-hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-[#121212] text-white px-4 py-2 text-sm focus:outline-none focus:border-blue-500 border border-transparent"
          />
        </div>
        <button
          type="submit"
          className="bg-[#222222] border border-l-0 border-[#303030] px-5 py-2 rounded-r-full hover:bg-[#3d3d3d] transition-colors"
        >
          <HiSearch className="text-white text-lg" />
        </button>
      </form>

      {/* Right */}
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link
              to="/upload"
              className="p-2 rounded-full hover:bg-[#272727] flex items-center gap-1 text-white text-sm"
            >
              <MdVideoCall className="text-2xl" />
              <span className="hidden sm:block text-sm">Upload</span>
            </Link>
            <button className="p-2 rounded-full hover:bg-[#272727]">
              <HiBell className="text-white text-xl" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm"
              >
                {user.avatar
                  ? <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  : user.username?.[0]?.toUpperCase()
                }
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-10 bg-[#212121] rounded-xl shadow-xl border border-[#3d3d3d] w-56 py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#3d3d3d]">
                    <p className="text-white font-semibold text-sm">{user.username}</p>
                    <p className="text-[#aaa] text-xs">{user.email}</p>
                  </div>
                  <Link
                    to="/my-channel"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-[#3d3d3d] text-white text-sm"
                  >
                    <HiUser /> My Channel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#3d3d3d] text-white text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 border border-blue-500 text-blue-500 hover:bg-blue-500/10 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            <HiUser /> Sign In
          </Link>
        )}
      </div>
    </header>
  )
}