import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  AiOutlineHome, AiFillHome,
  MdOutlineSubscriptions, MdSubscriptions,
  MdOutlineVideoLibrary, MdVideoLibrary,
  MdHistory, MdOutlineWatchLater, MdThumbUp,
  MdVideoCall, MdOutlineVideoCall,
  MdPerson, MdSportsEsports, MdMusicNote,
  MdSchool, MdCode, MdSettings
} from 'react-icons/md'
import { useTheme } from '../../context/ThemeContext'

const mainLinks = [
  { to: '/', label: 'Home', icon: <AiOutlineHome className="text-xl" /> },
  { to: '/search?q=', label: 'Explore', icon: <MdSportsEsports className="text-xl" /> },
]

const userLinks = [
  { to: '/my-channel', label: 'Your channel', icon: <MdPerson className="text-xl" /> },
  { to: '/upload', label: 'Upload video', icon: <MdVideoCall className="text-xl" /> },
]

const categoryLinks = [
  { to: '/search?q=gaming', label: 'Gaming', icon: <MdSportsEsports className="text-xl" /> },
  { to: '/search?q=music', label: 'Music', icon: <MdMusicNote className="text-xl" /> },
  { to: '/search?q=javascript', label: 'JavaScript', icon: <MdCode className="text-xl" /> },
  { to: '/search?q=python', label: 'Python', icon: <MdSchool className="text-xl" /> },
]

export default function Sidebar() {
  const { sidebarOpen } = useTheme()
  const { user } = useSelector(s => s.auth)

  if (!sidebarOpen) return null

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-56 bg-[#0f0f0f] overflow-y-auto z-40 py-2">
      <nav className="flex flex-col gap-1 px-2">
        {mainLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-[#272727] text-white' : 'text-white hover:bg-[#272727]'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}

        {user && (
          <>
            <div className="border-t border-[#3d3d3d] my-2" />
            {userLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#272727] text-white' : 'text-white hover:bg-[#272727]'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </>
        )}

        <div className="border-t border-[#3d3d3d] my-2" />
        <p className="px-3 py-1 text-white font-semibold text-sm">Explore</p>
        {categoryLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className="flex items-center gap-4 px-3 py-2 rounded-xl text-sm text-white hover:bg-[#272727] transition-colors"
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}

        {!user && (
          <>
            <div className="border-t border-[#3d3d3d] my-2" />
            <div className="px-3 py-2">
              <p className="text-sm text-[#aaa] mb-3">Sign in to like videos, comment, and subscribe.</p>
              <NavLink
                to="/login"
                className="flex items-center gap-2 border border-blue-500 text-blue-500 hover:bg-blue-500/10 px-3 py-1.5 rounded-full text-sm font-medium transition-colors w-fit"
              >
                Sign In
              </NavLink>
            </div>
          </>
        )}
      </nav>
    </aside>
  )
}