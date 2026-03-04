import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('yt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('yt_token')
      localStorage.removeItem('yt_user')
    }
    return Promise.reject(err)
  }
)

export default API