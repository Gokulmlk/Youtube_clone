import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import VideoPage from './pages/VideoPage'
// import SearchPage from './pages/SearchPage'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import ChannelPage from './pages/ChannelPage'
// import MyChannel from './pages/MyChannel'
// import UploadVideo from './pages/UploadVideo'
// import NotFound from './pages/NotFound'
import ProtectedRoute from './components/common/ProtectedRoute'

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="video/:id" element={<VideoPage />} />
          {/* <Route path="search" element={<SearchPage />} /> */}
          <Route path="channel/:id" element={<ChannelPage />} />
          <Route
            path="my-channel"
            element={<ProtectedRoute><MyChannel /></ProtectedRoute>}
          />
          <Route
            path="upload"
            element={<ProtectedRoute><UploadVideo /></ProtectedRoute>}
          />
        </Route>
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}