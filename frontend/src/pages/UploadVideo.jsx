import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MdCloudUpload } from 'react-icons/md'
import { uploadVideo, updateVideo, fetchVideoById } from '../store/slices/videoSlice'
import { fetchMyChannels } from '../store/slices/channelSlice'
import { CATEGORIES } from '../utils/formatters'
import { toast } from 'react-toastify'
import API from '../api/axios'

export default function UploadVideo() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const { myChannels } = useSelector(s => s.channel)
  const { loading } = useSelector(s => s.video)
  const [form, setForm] = useState({
    title: '', description: '', videoUrl: '', thumbnailUrl: '',
    channelId: '', category: 'Web Development', duration: '', isPublic: true
  })

  useEffect(() => {
    dispatch(fetchMyChannels())
  }, [dispatch])

  useEffect(() => {
    if (myChannels.length > 0 && !form.channelId) {
      setForm(f => ({ ...f, channelId: myChannels[0]._id }))
    }
  }, [myChannels])

  useEffect(() => {
    if (editId) {
      API.get(`/videos/${editId}`).then(res => {
        const v = res.data.video
        setForm({
          title: v.title, description: v.description || '',
          videoUrl: v.videoUrl, thumbnailUrl: v.thumbnailUrl || '',
          channelId: v.channelId?._id || v.channelId,
          category: v.category, duration: v.duration || '', isPublic: v.isPublic !== false
        })
      })
    }
  }, [editId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.channelId) { toast.error('Please create a channel first'); navigate('/my-channel'); return }
    let result
    if (editId) {
      result = await dispatch(updateVideo({ id: editId, data: form }))
      if (updateVideo.fulfilled.match(result)) {
        toast.success('Video updated!')
        navigate(`/video/${editId}`)
      } else {
        toast.error(result.payload || 'Update failed')
      }
    } else {
      result = await dispatch(uploadVideo(form))
      if (uploadVideo.fulfilled.match(result)) {
        toast.success('Video uploaded!')
        navigate(`/video/${result.payload.video._id}`)
      } else {
        toast.error(result.payload || 'Upload failed')
      }
    }
  }

  if (myChannels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-6">
        <MdCloudUpload className="text-7xl text-[#aaa] mb-4" />
        <h2 className="text-white font-bold text-xl mb-2">Create a channel first</h2>
        <p className="text-[#aaa] text-sm mb-6">You need a channel before uploading videos</p>
        <button onClick={() => navigate('/my-channel')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors">
          Create Channel
        </button>
      </div>
    )
  }

  return (
    <div className="px-6 py-6 max-w-2xl">
      <h1 className="text-white text-2xl font-bold mb-6">{editId ? 'Edit Video' : 'Upload Video'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-[#aaa] text-sm font-medium mb-1.5 block">Title *</label>
          <input
            type="text" name="title" value={form.title} onChange={handleChange}
            required maxLength={200} placeholder="Add a title that describes your video"
            className="w-full bg-[#212121] border border-[#3d3d3d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555]"
          />
        </div>

        <div>
          <label className="text-[#aaa] text-sm font-medium mb-1.5 block">Description</label>
          <textarea
            name="description" value={form.description} onChange={handleChange}
            rows={4} placeholder="Tell viewers about your video"
            className="w-full bg-[#212121] border border-[#3d3d3d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555] resize-none"
          />
        </div>

        <div>
          <label className="text-[#aaa] text-sm font-medium mb-1.5 block">Video URL *</label>
          <input
            type="url" name="videoUrl" value={form.videoUrl} onChange={handleChange}
            required placeholder="https://example.com/video.mp4 or YouTube URL"
            className="w-full bg-[#212121] border border-[#3d3d3d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555]"
          />
          <p className="text-[#aaa] text-xs mt-1">Accepts direct video URLs or YouTube links</p>
        </div>

        <div>
            <label className="text-[#aaa] text-sm font-medium mb-1.5 block">
                    Upload Video From Computer
            </label>
            <input
                type="file"
                accept="video/*"
                onChange={handleChange}
                className="w-full bg-[#212121] border border-[#3d3d3d] text-white rounded-xl px-4 py-3 text-sm"
            />
        </div>

        <div>
          <label className="text-[#aaa] text-sm font-medium mb-1.5 block">Thumbnail URL</label>
          <input
            type="url" name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange}
            placeholder="https://example.com/thumbnail.jpg"
            className="w-full bg-[#212121] border border-[#3d3d3d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555]"
          />
          {form.thumbnailUrl && (
            <img src={form.thumbnailUrl} alt="preview" className="mt-2 w-48 aspect-video object-cover rounded-lg" onError={(e) => e.target.style.display='none'} />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[#aaa] text-sm font-medium mb-1.5 block">Channel *</label>
            <select
              name="channelId" value={form.channelId} onChange={handleChange}
              className="w-full bg-[#212121] border border-[#3d3d3d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            >
              {myChannels.map(ch => (
                <option key={ch._id} value={ch._id}>{ch.channelName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[#aaa] text-sm font-medium mb-1.5 block">Category *</label>
            <select
              name="category" value={form.category} onChange={handleChange}
              className="w-full bg-[#212121] border border-[#3d3d3d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[#aaa] text-sm font-medium mb-1.5 block">Duration (e.g. 10:30)</label>
          <input
            type="text" name="duration" value={form.duration} onChange={handleChange}
            placeholder="10:30"
            className="w-full bg-[#212121] border border-[#3d3d3d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555]"
          />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" name="isPublic" id="isPublic" checked={form.isPublic} onChange={handleChange} className="w-4 h-4 accent-blue-600" />
          <label htmlFor="isPublic" className="text-[#aaa] text-sm cursor-pointer">Make this video public</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-[#272727] hover:bg-[#3d3d3d] text-white text-sm font-semibold rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <MdCloudUpload className="text-lg" />
            {loading ? (editId ? 'Saving...' : 'Uploading...') : (editId ? 'Save Changes' : 'Upload Video')}
          </button>
        </div>
      </form>
    </div>
  )
}