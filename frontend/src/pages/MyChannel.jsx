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

  // shared input class used in both modals
  const inputCls = "w-full bg-[#121212] border border-[#3d3d3d] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-[#555]"

  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 max-w-6xl mx-auto w-full">

      {/* ── Page Header ── */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mb-5 sm:mb-6">
        <h1 className="text-white text-xl sm:text-2xl font-bold">My Channel</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setShowCreateForm(true); setChannelForm({ channelName: '', description: '', channelAvatar: '' }) }}
            className="flex items-center gap-1.5 bg-[#272727] hover:bg-[#3d3d3d] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors"
          >
            <MdAdd className="text-base sm:text-lg" />
            <span>New Channel</span>
          </button>
          {selectedChannel && (
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors"
            >
              <MdVideoCall className="text-base sm:text-lg" />
              <span>Upload Video</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Create Channel Modal ── */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-3 sm:px-4">
          <div className="bg-[#212121] rounded-2xl p-5 sm:p-6 w-full max-w-md border border-[#3d3d3d] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold text-base sm:text-lg">Create Channel</h2>
              <button onClick={() => setShowCreateForm(false)} className="text-[#aaa] hover:text-white p-1">
                <MdClose className="text-xl" />
              </button>
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
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[#aaa] text-xs font-medium mb-1 block">Description</label>
                <textarea
                  value={channelForm.description}
                  onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                  placeholder="What is your channel about?"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className="text-[#aaa] text-xs font-medium mb-1 block">Avatar URL (optional)</label>
                <input
                  type="url"
                  value={channelForm.channelAvatar}
                  onChange={(e) => setChannelForm({ ...channelForm, channelAvatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className={inputCls}
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-[#aaa] hover:text-white text-sm rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="px-5 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Channel Modal ── */}
      {showEditForm && selectedChannel && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-3 sm:px-4">
          <div className="bg-[#212121] rounded-2xl p-5 sm:p-6 w-full max-w-md border border-[#3d3d3d] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold text-base sm:text-lg">Edit Channel</h2>
              <button onClick={() => setShowEditForm(false)} className="text-[#aaa] hover:text-white p-1">
                <MdClose className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleEditChannel} className="flex flex-col gap-4">
              <div>
                <label className="text-[#aaa] text-xs font-medium mb-1 block">Channel Name *</label>
                <input
                  type="text"
                  value={channelForm.channelName}
                  onChange={(e) => setChannelForm({ ...channelForm, channelName: e.target.value })}
                  required minLength={3}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[#aaa] text-xs font-medium mb-1 block">Description</label>
                <textarea
                  value={channelForm.description}
                  onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className="text-[#aaa] text-xs font-medium mb-1 block">Avatar URL</label>
                <input
                  type="url"
                  value={channelForm.channelAvatar}
                  onChange={(e) => setChannelForm({ ...channelForm, channelAvatar: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 text-[#aaa] hover:text-white text-sm rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="px-5 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── My Channels List ── */}
      {myChannels.length > 0 && (
        <div className="mb-5 sm:mb-6">
          <h2 className="text-white font-semibold mb-3 text-sm sm:text-base">Your Channels</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {myChannels.map(ch => (
              <div
                key={ch._id}
                onClick={() => handleSelectChannel(ch)}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl cursor-pointer transition-colors border group ${
                  selectedChannel?._id === ch._id
                    ? 'bg-white/10 border-white/30'
                    : 'border-[#3d3d3d] hover:bg-[#272727]'
                }`}
              >
                <img
                  src={ch.channelAvatar || `https://ui-avatars.com/api/?name=${ch.channelName}&background=random&color=fff`}
                  alt={ch.channelName}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${ch.channelName}&background=random&color=fff` }}
                />
                <span
                  className="text-xs sm:text-sm font-medium text-white hover:text-blue-400 transition-colors"
                  onClick={(e) => { e.stopPropagation(); navigate(`/channel/${ch._id}`) }}
                >
                  {ch.channelName}
                </span>
                <MdArrowForward
                  className="text-[#aaa] group-hover:text-white text-sm transition-colors ml-0.5"
                  onClick={(e) => { e.stopPropagation(); navigate(`/channel/${ch._id}`) }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Selected Channel Detail ── */}
      {selectedChannel ? (
        <div>

          {/* Channel info card */}
          <div className="bg-[#212121] rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 border border-[#3d3d3d]">
            {/* Mobile: stacked | sm+: row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

              {/* Avatar + text */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <img
                  src={selectedChannel.channelAvatar || `https://ui-avatars.com/api/?name=${selectedChannel.channelName}&background=random&color=fff&size=60`}
                  alt={selectedChannel.channelName}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${selectedChannel.channelName}&background=random&color=fff&size=60` }}
                />
                <div className="min-w-0">
                  <h2 className="text-white font-bold text-base sm:text-xl truncate">{selectedChannel.channelName}</h2>
                  <p className="text-[#aaa] text-xs sm:text-sm">{selectedChannel.handle}</p>
                  <p className="text-[#aaa] text-xs sm:text-sm">
                    {selectedChannel.subscribers || 0} subscribers • {channelVideos.length} videos
                  </p>
                  {selectedChannel.description && (
                    <p className="text-[#aaa] text-xs sm:text-sm mt-1 line-clamp-2">{selectedChannel.description}</p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap flex-shrink-0">
                <button
                  onClick={() => navigate(`/channel/${selectedChannel._id}`)}
                  className="flex items-center gap-1 bg-[#272727] hover:bg-[#3d3d3d] text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors"
                >
                  <MdArrowForward />
                  <span className="hidden sm:inline">View Channel</span>
                  <span className="sm:hidden">View</span>
                </button>
                <button
                  onClick={() => startEdit(selectedChannel)}
                  className="flex items-center gap-1 bg-[#272727] hover:bg-[#3d3d3d] text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors"
                >
                  <MdEdit />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteChannel(selectedChannel._id)}
                  className="flex items-center gap-1 bg-[#272727] hover:bg-red-600/20 text-red-400 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors"
                >
                  <MdDelete />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Videos section header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm sm:text-base">
              Videos
              <span className="text-[#aaa] font-normal ml-1">({channelVideos.length})</span>
            </h3>
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors"
            >
              <MdVideoCall className="text-base" />
              <span>Upload Video</span>
            </button>
          </div>

          {/* Empty state */}
          {channelVideos.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-[#212121] rounded-2xl border border-[#3d3d3d] px-4">
              <MdVideoCall className="text-5xl sm:text-6xl text-[#aaa] mx-auto mb-3" />
              <p className="text-white font-semibold text-sm sm:text-base mb-2">No videos yet</p>
              <p className="text-[#aaa] text-xs sm:text-sm mb-4">Upload your first video to get started</p>
              <button
                onClick={() => navigate('/upload')}
                className="bg-red-600 hover:bg-red-700 text-white px-5 sm:px-6 py-2 rounded-full text-sm font-semibold transition-colors"
              >
                Upload Video
              </button>
            </div>
          ) : (
            /*
              Video table breakpoints:
              mobile  (< sm)  → thumbnail + title + actions
              sm      (640px) → + Views
              md      (768px) → + Category
              lg      (1024px)→ + Date
            */
            <div className="bg-[#212121] rounded-2xl border border-[#3d3d3d] overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[300px]">
                <thead className="border-b border-[#3d3d3d]">
                  <tr className="text-[#aaa]">
                    <th className="px-3 sm:px-4 py-3 text-left font-medium">Video</th>
                    <th className="px-3 sm:px-4 py-3 text-left font-medium hidden md:table-cell">Category</th>
                    <th className="px-3 sm:px-4 py-3 text-left font-medium hidden sm:table-cell">Views</th>
                    <th className="px-3 sm:px-4 py-3 text-left font-medium hidden lg:table-cell">Date</th>
                    <th className="px-3 sm:px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {channelVideos.map(v => (
                    <tr
                      key={v._id}
                      className="border-b border-[#3d3d3d] hover:bg-[#272727] transition-colors cursor-pointer"
                      onClick={() => navigate(`/video/${v._id}`)}
                    >
                      {/* Thumbnail + Title */}
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img
                            src={v.thumbnailUrl || `https://picsum.photos/seed/${v._id}/120/68`}
                            alt={v.title}
                            className="w-16 sm:w-24 aspect-video object-cover rounded flex-shrink-0"
                            onError={(e) => { e.target.src = `https://picsum.photos/seed/${v._id}/120/68` }}
                          />
                          <span className="text-white font-medium line-clamp-2 text-xs sm:text-sm max-w-[100px] xs:max-w-[150px] sm:max-w-xs">
                            {v.title}
                          </span>
                        </div>
                      </td>

                      {/* Category — md+ only */}
                      <td className="px-3 sm:px-4 py-3 text-[#aaa] text-xs sm:text-sm hidden md:table-cell">
                        {v.category}
                      </td>

                      {/* Views — sm+ only */}
                      <td className="px-3 sm:px-4 py-3 text-[#aaa] text-xs sm:text-sm hidden sm:table-cell">
                        {formatViews(v.views)}
                      </td>

                      {/* Date — lg+ only */}
                      <td className="px-3 sm:px-4 py-3 text-[#aaa] text-xs sm:text-sm hidden lg:table-cell">
                        {timeAgo(v.createdAt)}
                      </td>

                      {/* Edit + Delete — stopPropagation so row click doesn't fire */}
                      <td className="px-3 sm:px-4 py-3">
                        <div
                          className="flex gap-1 justify-end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => navigate(`/upload?edit=${v._id}`)}
                            className="p-1 sm:p-1.5 hover:bg-[#3d3d3d] text-[#aaa] hover:text-white rounded transition-colors"
                            title="Edit video"
                          >
                            <MdEdit className="text-sm sm:text-base" />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(v._id)}
                            className="p-1 sm:p-1.5 hover:bg-red-600/20 text-[#aaa] hover:text-red-400 rounded transition-colors"
                            title="Delete video"
                          >
                            <MdDelete className="text-sm sm:text-base" />
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
        /* No channels empty state */
        <div className="text-center py-16 sm:py-20 bg-[#212121] rounded-2xl border border-[#3d3d3d] px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#272727] flex items-center justify-center mx-auto mb-4">
            <MdVideoCall className="text-3xl sm:text-4xl text-[#aaa]" />
          </div>
          <p className="text-white font-semibold text-base sm:text-lg mb-2">No channels yet</p>
          <p className="text-[#aaa] text-xs sm:text-sm mb-5 sm:mb-6">Create a channel to start uploading videos</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 sm:px-6 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            <MdAdd /> Create Channel
          </button>
        </div>
      )}
    </div>
  )
}