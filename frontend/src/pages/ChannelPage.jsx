import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannelById, toggleSubscribe, clearCurrentChannel } from '../store/slices/channelSlice'
import { fetchVideosByChannel } from '../store/slices/videoSlice'
import VideoCard from '../components/common/VideoCard'
import Loader from '../components/common/Loader'
import { formatSubscribers } from '../utils/formatters'
import { toast } from 'react-toastify'

export default function ChannelPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentChannel, loading } = useSelector(s => s.channel)
  const { channelVideos } = useSelector(s => s.video)
  const { user } = useSelector(s => s.auth)

  useEffect(() => {
    dispatch(fetchChannelById(id))
    dispatch(fetchVideosByChannel(id))
    return () => dispatch(clearCurrentChannel())
  }, [id, dispatch])

  const handleSubscribe = () => {
    if (!user) { toast.info('Please sign in to subscribe'); navigate('/login'); return }
    dispatch(toggleSubscribe(id))
  }

  if (loading) return <Loader />
  if (!currentChannel) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[#aaa]">Channel not found</p>
    </div>
  )

  const isOwner = user && (user._id === currentChannel.owner?._id || user._id === currentChannel.owner)

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-32 sm:h-48 bg-gradient-to-r from-purple-900 via-blue-900 to-red-900 overflow-hidden">
        {currentChannel.channelBanner && (
          <img src={currentChannel.channelBanner} alt="banner" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Channel info */}
      <div className="px-6 py-4 border-b border-[#3d3d3d]">
        <div className="flex items-start gap-6 max-w-5xl">
          <img
            src={currentChannel.channelAvatar || `https://ui-avatars.com/api/?name=${currentChannel.channelName}&background=random&color=fff&size=80`}
            alt={currentChannel.channelName}
            className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${currentChannel.channelName}&background=random&color=fff&size=80` }}
          />
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">{currentChannel.channelName}</h1>
            <p className="text-[#aaa] text-sm mt-1">{currentChannel.handle}</p>
            <p className="text-[#aaa] text-sm">{formatSubscribers(currentChannel.subscribers)} • {channelVideos.length} videos</p>
            {currentChannel.description && (
              <p className="text-[#aaa] text-sm mt-2 max-w-2xl">{currentChannel.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            {isOwner ? (
              <button
                onClick={() => navigate('/my-channel')}
                className="bg-[#272727] hover:bg-[#3d3d3d] text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              >
                Manage Channel
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                  currentChannel.subscribed
                    ? 'bg-[#272727] hover:bg-[#3d3d3d] text-white'
                    : 'bg-white hover:bg-gray-200 text-black'
                }`}
              >
                {currentChannel.subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Videos */}
      <div className="px-6 py-6 max-w-screen-xl">
        <h2 className="text-white font-bold text-lg mb-4">Videos ({channelVideos.length})</h2>
        {channelVideos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#aaa] text-lg">No videos yet</p>
            {isOwner && (
              <button onClick={() => navigate('/upload')} className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors">
                Upload your first video
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {channelVideos.map(video => <VideoCard key={video._id} video={video} />)}
          </div>
        )}
      </div>
    </div>
  )
}