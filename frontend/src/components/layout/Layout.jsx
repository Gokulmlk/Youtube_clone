import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { useTheme } from '../../context/ThemeContext'

export default function Layout() {
  const { sidebarOpen } = useTheme()
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <Sidebar />
      <main className={`pt-14 transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
        <Outlet />
      </main>
    </div>
  )
}