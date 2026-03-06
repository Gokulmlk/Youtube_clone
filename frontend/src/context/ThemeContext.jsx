import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
   const [darkMode, setDarkMode] = useState(() => {
    // remember user's preference from localStorage
    return localStorage.getItem('yt_theme') !== 'light'
  })

  useEffect(() => {
    localStorage.setItem('yt_theme', darkMode ? 'dark' : 'light')
    document.documentElement.classList.toggle('light-mode', !darkMode)
  }, [darkMode])


  const toggleSidebar = () => setSidebarOpen(prev => !prev)
  const toggleTheme = () => setDarkMode(prev => !prev)

  return (
    <ThemeContext.Provider value={{ sidebarOpen, toggleSidebar, darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)