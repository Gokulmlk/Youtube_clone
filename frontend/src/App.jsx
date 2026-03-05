import { Routes } from "react-router-dom";

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="video/:id" element={<VideoPage />} />
          <Route path="search" element={<SearchPage />} />
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}