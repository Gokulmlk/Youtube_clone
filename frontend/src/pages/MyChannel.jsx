import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdEdit, MdDelete, MdAdd, MdVideoCall, MdClose, MdArrowForward } from 'react-icons/md'
import {
  fetchMyChannels, createChannel, updateChannel, deleteChannel
} from '../store/slices/channelSlice'
import { fetchVideosByChannel, deleteVideo } from '../store/slices/videoSlice'
import { formatViews, timeAgo } from '../utils/formatters'
import { toast } from 'react-toastify'
import Loader from '../components/common/Loader'

export default function MyChannel() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { myChannels, loading, error } = useSelector(s => s.channel)
  const { channelVideos } = useSelector(s => s.video)
  const { user } = useSelector(s => s.auth)
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [channelForm, setChannelForm] = useState({ channelName: '', description: '', channelAvatar: '' })

  useEffect(() => {
    dispatch(fetchMyChannels())
  }, [dispatch])

  useEffect(() => {
    if (myChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(myChannels[0])
      dispatch(fetchVideosByChannel(myChannels[0]._id))
    }
  }, [myChannels])

  const handleSelectChannel = (ch) => {
    setSelectedChannel(ch)
    dispatch(fetchVideosByChannel(ch._id))
  }

  const handleCreateChannel = async (e) => {
    e.preventDefault()
    if (!channelForm.channelName.trim()) return
    const result = await dispatch(createChannel(channelForm))
    if (createChannel.fulfilled.match(result)) {
      toast.success('Channel created!')
      setShowCreateForm(false)
      setChannelForm({ channelName: '', description: '', channelAvatar: '' })
      const newCh = result.payload.channel
      setSelectedChannel(newCh)
      dispatch(fetchVideosByChannel(newCh._id))
    } else {
      toast.error(error || 'Failed to create channel')
    }
  }

  const handleEditChannel = async (e) => {
    e.preventDefault()
    const result = await dispatch(updateChannel({ id: selectedChannel._id, data: channelForm }))
    if (updateChannel.fulfilled.match(result)) {
      toast.success('Channel updated!')
      setShowEditForm(false)
      setSelectedChannel(result.payload.channel)
    } else {
      toast.error('Failed to update channel')
    }
  }

  const handleDeleteChannel = async (id) => {
    if (!confirm('Delete this channel and all its videos?')) return
    await dispatch(deleteChannel(id))
    setSelectedChannel(null)
    toast.success('Channel deleted')
    dispatch(fetchMyChannels())
  }

  const handleDeleteVideo = async (videoId) => {
    if (!confirm('Delete this video?')) return
    await dispatch(deleteVideo(videoId))
    toast.success('Video deleted')
    if (selectedChannel) dispatch(fetchVideosByChannel(selectedChannel._id))
  }

  const startEdit = (ch) => {
    setChannelForm({ channelName: ch.channelName, description: ch.description || '', channelAvatar: ch.channelAvatar || '' })
    setShowEditForm(true)
  }

  return (
    <div className="px-6 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-bold">My Channel</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowCreateForm(true); setChannelForm({ channelName: '', description: '', channelAvatar: '' }) }}
            className="flex items-center gap-2 bg-[#272727] hover:bg-[#3d3d3d] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <MdAdd /> New Channel
          </button>
          {selectedChannel && (
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              <MdVideoCall /> Upload Video
            </button>
          )}
        </div>
      </div>

      {/* Create Channel Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-[#212121] rounded-2xl p-6 w-full max-w-md border border-[#3d3d3d]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold text-lg">Create Channel</h2>
              <button onClick={() => setShowCreateForm(false)} className="text-[#aaa] hover:text-white"><MdClose className="text-xl" /></button>
            </div>
            <form onSubmit={handleCreateChannel} className="flex flex-col gap-4">
              <div>
                <label className="text-[#aaa] text-xs font-medium mb-1 block">Channel Name *</label>
                <input
                  type="text"
                  value={channelForm.channelName}
                  onChange={(e) => setChannelForm({ ...channelForm, channelName: e.target.value })}
                  required minLength={3}
                  placeholder="My Awesome Channel"
                  className="w-full bg-[#121212] border border-[#3d3d3d] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555]"
                />
              </div>
              <div>
                <label className="text-[#aaa] text-xs font-medium mb-1 block">Description</label>
                <textarea
                  value={channelForm.description}
                  onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                  placeholder="What is your channel about?"
                  rows={3}
                  className="w-full bg-[#121212] border border-[#3d3d3d] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555] resize-none"
                />
              </div>
              <div>
                <label className="text-[#aaa] text-xs font-medium mb-1 block">Avatar URL (optional)</label>
                <input
                  type="url"
                  value={channelForm.channelAvatar}
                  onChange={(e) => setChannelForm({ ...channelForm, channelAvatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-[#121212] border border-[#3d3d3d] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555]"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 text-[#aaa] hover:text-white text-sm rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Channel Modal */}
      {showEditForm && selectedChannel && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-[#212121] rounded-2xl p-6 w-full max-w-md border border-[#3d3d3d]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold text-lg">Edit Channel</h2>
              <button onClick={() => setShowEditForm(false)} className="text-[#aaa] hover:text-white"><MdClose className="text-xl" /></button>
            </div>
            <form onSubmit={handleEditChannel} className="flex flex-col gap-4">
              <div>
                <label className="text-[#aaa] text-xs font-medium mb-1 block">Channel Name *</label>
                <input
                  type="text"
                  value={channelForm.channelName}
                  onChange={(e) => setChannelForm({ ...channelForm, channelName: e.target.value })}
                  required minLength={3}
                  className="w-full bg-[#121212] border border-[#3d3d3d] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[#aaa] text-xs font-medium mb-1 block">Description</label>
                <textarea
                  value={channelForm.description}
                  onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#121212] border border-[#3d3d3d] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-[#aaa] text-xs font-medium mb-1 block">Avatar URL</label>
                <input
                  type="url"
                  value={channelForm.channelAvatar}
                  onChange={(e) => setChannelForm({ ...channelForm, channelAvatar: e.target.value })}
                  className="w-full bg-[#121212] border border-[#3d3d3d] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" onClick={() => setShowEditForm(false)} className="px-4 py-2 text-[#aaa] hover:text-white text-sm rounded-lg">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== MY CHANNELS LIST ========== */}
      {myChannels.length > 0 && (
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-3">Your Channels</h2>
          <div className="flex flex-wrap gap-3">
            {myChannels.map(ch => (
              <div
                key={ch._id}
                // clicking avatar side → selects channel in dashboard below
                onClick={() => handleSelectChannel(ch)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-colors border group ${
                  selectedChannel?._id === ch._id
                    ? 'bg-white/10 border-white/30'
                    : 'border-[#3d3d3d] hover:bg-[#272727]'
                }`}
              >
                <img
                  src={ch.channelAvatar || `https://ui-avatars.com/api/?name=${ch.channelName}&background=random&color=fff`}
                  alt={ch.channelName}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${ch.channelName}&background=random&color=fff` }}
                />

                {/* Channel name → navigate to channel page */}
                <span
                  className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()           // don't trigger parent's handleSelectChannel
                    navigate(`/channel/${ch._id}`)
                  }}
                >
                  {ch.channelName}
                </span>

                {/* Arrow icon → also navigates to channel page */}
                <MdArrowForward
                  className="text-[#aaa] group-hover:text-white text-sm transition-colors ml-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/channel/${ch._id}`)
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== SELECTED CHANNEL DETAIL ========== */}
      {selectedChannel ? (
        <div>
          <div className="bg-[#212121] rounded-2xl p-5 mb-6 border border-[#3d3d3d]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedChannel.channelAvatar || `https://ui-avatars.com/api/?name=${selectedChannel.channelName}&background=random&color=fff&size=60`}
                  alt={selectedChannel.channelName}
                  className="w-14 h-14 rounded-full object-cover"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${selectedChannel.channelName}&background=random&color=fff&size=60` }}
                />
                <div>
                  <h2 className="text-white font-bold text-xl">{selectedChannel.channelName}</h2>
                  <p className="text-[#aaa] text-sm">{selectedChannel.handle}</p>
                  <p className="text-[#aaa] text-sm">{selectedChannel.subscribers || 0} subscribers • {channelVideos.length} videos</p>
                  {selectedChannel.description && <p className="text-[#aaa] text-sm mt-1">{selectedChannel.description}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                {/* View public channel page */}
                <button
                  onClick={() => navigate(`/channel/${selectedChannel._id}`)}
                  className="flex items-center gap-1 bg-[#272727] hover:bg-[#3d3d3d] text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  <MdArrowForward /> View Channel
                </button>
                <button onClick={() => startEdit(selectedChannel)} className="flex items-center gap-1 bg-[#272727] hover:bg-[#3d3d3d] text-white px-3 py-1.5 rounded-lg text-sm transition-colors">
                  <MdEdit /> Edit
                </button>
                <button onClick={() => handleDeleteChannel(selectedChannel._id)} className="flex items-center gap-1 bg-[#272727] hover:bg-red-600/20 text-red-400 px-3 py-1.5 rounded-lg text-sm transition-colors">
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Videos ({channelVideos.length})</h3>
            <button onClick={() => navigate('/upload')} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
              <MdVideoCall /> Upload Video
            </button>
          </div>

          {channelVideos.length === 0 ? (
            <div className="text-center py-16 bg-[#212121] rounded-2xl border border-[#3d3d3d]">
              <MdVideoCall className="text-6xl text-[#aaa] mx-auto mb-3" />
              <p className="text-white font-semibold mb-2">No videos yet</p>
              <p className="text-[#aaa] text-sm mb-4">Upload your first video to get started</p>
              <button onClick={() => navigate('/upload')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors">Upload Video</button>
            </div>
          ) : (
            <div className="bg-[#212121] rounded-2xl border border-[#3d3d3d] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-[#3d3d3d]">
                  <tr className="text-[#aaa]">
                    <th className="px-4 py-3 text-left font-medium">Video</th>
                    <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Category</th>
                    <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Views</th>
                    <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Date</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {channelVideos.map(v => (
                    <tr
                      key={v._id}
                      className="border-b border-[#3d3d3d] hover:bg-[#272727] transition-colors cursor-pointer"
                      // ✅ clicking the row opens the video page
                      onClick={() => navigate(`/video/${v._id}`)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.thumbnailUrl || `https://picsum.photos/seed/${v._id}/120/68`}
                            alt={v.title}
                            className="w-24 aspect-video object-cover rounded flex-shrink-0"
                            onError={(e) => { e.target.src = `https://picsum.photos/seed/${v._id}/120/68` }}
                          />
                          <span className="text-white font-medium line-clamp-2 max-w-xs">{v.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#aaa] hidden sm:table-cell">{v.category}</td>
                      <td className="px-4 py-3 text-[#aaa] hidden md:table-cell">{formatViews(v.views)}</td>
                      <td className="px-4 py-3 text-[#aaa] hidden lg:table-cell">{timeAgo(v.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div
                          className="flex gap-1 justify-end"
                          // ✅ stop row click when pressing edit/delete buttons
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => navigate(`/upload?edit=${v._id}`)}
                            className="p-1.5 hover:bg-[#3d3d3d] text-[#aaa] hover:text-white rounded transition-colors"
                            title="Edit video"
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(v._id)}
                            className="p-1.5 hover:bg-red-600/20 text-[#aaa] hover:text-red-400 rounded transition-colors"
                            title="Delete video"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#212121] rounded-2xl border border-[#3d3d3d]">
          <p className="text-white font-semibold text-lg mb-2">No channels yet</p>
          <p className="text-[#aaa] text-sm mb-6">Create a channel to start uploading videos</p>
          <button onClick={() => setShowCreateForm(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 mx-auto">
            <MdAdd /> Create Channel
          </button>
        </div>
      )}
    </div>
  )
}