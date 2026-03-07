import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannelById, toggleSubscribe, clearCurrentChannel } from '../store/slices/channelSlice'
import { fetchVideosByChannel } from '../store/slices/videoSlice'
import VideoCard from '../components/common/VideoCard'
import Loader from '../components/common/Loader'
import { formatSubscribers } from '../utils/formatters'
import { toast } from 'react-toastify'
import { MdSettings, MdNotificationsActive } from 'react-icons/md'

export default function ChannelPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentChannel, loading, subscribedChannels } = useSelector(s => s.channel)
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

  const isOwner = user && (
    user._id === currentChannel.owner?._id ||
    user._id === currentChannel.owner
  )

  const isSubscribed = subscribedChannels?.includes(id) || currentChannel.subscribed

  return (
    <div className="min-h-screen">

      {/* ── Banner ── */}
      <div className="w-full h-28 sm:h-40 md:h-52 lg:h-60 overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-red-900">
        {currentChannel.channelBanner && (
          <img
            src={currentChannel.channelBanner}
            alt="banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* ── Channel Info ── */}
            <div className="px-3 sm:px-6 pt-3 pb-4 border-b border-[#3d3d3d]">
        <div className="max-w-screen-xl mx-auto">

          {/* Top row: avatar + info + buttons */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">

            {/* ── Avatar ── */}
            <div className="flex-shrink-0 -mt-8 sm:-mt-12">
              <img
                src={
                  currentChannel.channelAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(currentChannel.channelName)}&background=random&color=fff&size=80`
                }
                alt={currentChannel.channelName}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#0f0f0f] shadow-xl bg-[#212121]"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentChannel.channelName)}&background=random&color=fff&size=80`
                }}
              />
            </div>

            {/* ── Channel text info ── */}
            <div className="flex-1 min-w-0 mt-1 sm:mt-2">
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold truncate">
                {currentChannel.channelName}
              </h1>
              <p className="text-[#aaa] text-xs sm:text-sm mt-0.5">
                {currentChannel.handle}
              </p>
              <p className="text-[#aaa] text-xs sm:text-sm mt-0.5">
                {formatSubscribers(currentChannel.subscribers)} • {channelVideos.length} video{channelVideos.length !== 1 ? 's' : ''}
              </p>
              {currentChannel.description && (
                <p className="text-[#aaa] text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {currentChannel.description}
                </p>
              )}
            </div>

            {/* ── Action buttons ── */}
            <div className="flex items-center gap-2 flex-shrink-0 mt-1 sm:mt-3">
              {isOwner ? (
                <button
                  onClick={() => navigate('/my-channel')}
                  className="flex items-center gap-2 bg-[#272727] hover:bg-[#3d3d3d] text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                >
                  <MdSettings className="text-base" />
                  Manage Channel
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSubscribe}
                    className={`px-5 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      isSubscribed
                        ? 'bg-[#272727] hover:bg-[#3d3d3d] text-white'
                        : 'bg-white hover:bg-gray-200 text-black'
                    }`}
                  >
                    {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
                  </button>
                  {isSubscribed && (
                    <button className="p-2 bg-[#272727] hover:bg-[#3d3d3d] rounded-full transition-colors">
                      <MdNotificationsActive className="text-white text-lg" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex mt-4 overflow-x-auto">
            {['Videos', 'About'].map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  i === 0
                    ? 'border-white text-white'
                    : 'border-transparent text-[#aaa] hover:text-white hover:border-[#aaa]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Videos Grid ── */}
      <div className="px-3 sm:px-6 py-4 sm:py-6 max-w-screen-xl mx-auto">
        <h2 className="text-white font-bold text-base sm:text-lg mb-4">
          Videos
          <span className="text-[#aaa] font-normal text-sm ml-2">({channelVideos.length})</span>
        </h2>

        {channelVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#272727] flex items-center justify-center mb-4">
              <span className="text-3xl sm:text-4xl">🎬</span>
            </div>
            <p className="text-white font-semibold text-base sm:text-lg mb-1">No videos yet</p>
            <p className="text-[#aaa] text-sm">
              {isOwner ? 'Upload your first video to get started' : 'This channel has not uploaded any videos yet'}
            </p>
            {isOwner && (
              <button
                onClick={() => navigate('/upload')}
                className="mt-5 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
              >
                Upload Video
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8">
            {channelVideos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}