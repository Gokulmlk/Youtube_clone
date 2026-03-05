import { Link } from 'react-router-dom'
import { HiVideoCamera } from 'react-icons/hi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-center px-4">
      <HiVideoCamera className="text-red-600 text-8xl mb-6" />
      <h1 className="text-white text-4xl font-bold mb-2">404</h1>
      <p className="text-white text-xl font-semibold mb-2">Page not found</p>
      <p className="text-[#aaa] text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-full text-sm font-semibold transition-colors">
        Go to Home
      </Link>
    </div>
  )
}