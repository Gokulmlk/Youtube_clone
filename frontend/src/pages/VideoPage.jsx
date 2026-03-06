import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { MdShare, MdDelete, MdEdit } from 'react-icons/md'
import { fetchVideoById, deleteVideo, clearCurrentVideo } from '../store/slices/videoSlice'
import { fetchVideosByChannel } from '../store/slices/videoSlice'
import { toggleSubscribe } from '../store/slices/channelSlice'
import VideoPlayer from '../components/video/VideoPlayer'
import LikeDislikeButtons from '../components/video/LikeDislikeButtons'
import CommentSection from '../components/video/CommentSection'
import VideoCard from '../components/common/VideoCard'
import Loader from '../components/common/Loader'
import Avatar from '../components/common/Avatar'
import { formatViews, formatSubscribers, timeAgo } from '../utils/formatters'
import { toast } from 'react-toastify'

export default function VideoPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentVideo, loading, channelVideos } = useSelector(s => s.video)
  const { user } = useSelector(s => s.auth)
  const { subscribedChannels } = useSelector(s => s.channel)
  const isSubscribed = user && currentVideo?.channelId?._id
  && subscribedChannels.includes(currentVideo.channelId._id)

  useEffect(() => {
    dispatch(fetchVideoById(id))
    return () => dispatch(clearCurrentVideo())
  }, [id, dispatch])

  useEffect(() => {
    if (currentVideo?.channelId?._id) {
      dispatch(fetchVideosByChannel(currentVideo.channelId._id))
    }
  }, [currentVideo, dispatch])

  const handleSubscribe = () => {
    if (!user) { toast.info('Please sign in to subscribe'); navigate('/login'); return }
    dispatch(toggleSubscribe(currentVideo.channelId._id))
  }
 

  const handleDelete = async () => {
    if (!confirm('Delete this video?')) return
    await dispatch(deleteVideo(id))
    toast.success('Video deleted')
    navigate('/')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  if (loading) return <Loader />
  if (!currentVideo) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[#aaa]">Video not found</p>
    </div>
  )

  const channel = currentVideo.channelId
  const isOwner = user && (user._id === currentVideo.uploader?._id || user._id === currentVideo.uploader)
  const relatedVideos = channelVideos.filter(v => v._id !== id).slice(0, 10)

  return (
    <div className="flex gap-6 px-4 py-4 max-w-screen-2xl mx-auto">
      {/* Main */}
      <div className="flex-1 min-w-0">
        <VideoPlayer
          videoUrl={currentVideo.videoUrl}
          thumbnailUrl={currentVideo.thumbnailUrl}
          title={currentVideo.title}
        />

        <div className="mt-4">
          <h1 className="text-white font-bold text-xl leading-tight">{currentVideo.title}</h1>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            {/* Channel info */}
            <div className="flex items-center gap-3">
              <Link to={`/channel/${channel?._id}`} className="flex items-center gap-3">
                <Avatar src={channel?.channelAvatar} name={channel?.channelName} size="md" />
                <div>
                  <p className="text-white font-semibold text-sm">{channel?.channelName}</p>
                  <p className="text-[#aaa] text-xs">{formatSubscribers(channel?.subscribers)}</p>
                </div>
              </Link>
              <button
                onClick={handleSubscribe}
                className={`ml-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  isSubscribed
                    ? 'bg-[#272727] hover:bg-[#3d3d3d] text-white'   // already subscribed
                    : 'bg-white hover:bg-gray-200 text-black'          // not subscribed
                }`}
              >
               {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <LikeDislikeButtons video={currentVideo} />
              <button onClick={handleShare} className="flex items-center gap-2 bg-[#272727] hover:bg-[#3d3d3d] text-white px-4 py-2 rounded-full text-sm transition-colors">
                <MdShare /> Share
              </button>
              {isOwner && (
                <>
                  <button
                    onClick={() => navigate(`/upload?edit=${id}`)}
                    className="flex items-center gap-1 bg-[#272727] hover:bg-[#3d3d3d] text-white px-3 py-2 rounded-full text-sm transition-colors"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 bg-[#272727] hover:bg-red-600/20 text-red-400 px-3 py-2 rounded-full text-sm transition-colors"
                  >
                    <MdDelete />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#272727] rounded-xl p-3 mt-4">
            <p className="text-white text-sm font-medium">
              {formatViews(currentVideo.views)} views • {timeAgo(currentVideo.createdAt)} • {currentVideo.category}
            </p>
            {currentVideo.description && (
              <p className="text-[#f1f1f1] text-sm mt-2 whitespace-pre-wrap leading-relaxed">
                {currentVideo.description}
              </p>
            )}
          </div>

          <CommentSection videoId={id} />
        </div>
      </div>

      {/* Sidebar - Related videos */}
      <aside className="w-80 flex-shrink-0 hidden lg:flex flex-col gap-3">
        <h3 className="text-white font-semibold text-sm px-1">More from {channel?.channelName}</h3>
        {relatedVideos.map(v => (
          <Link key={v._id} to={`/video/${v._id}`} className="flex gap-2 group hover:bg-[#272727] rounded-xl p-2 transition-colors">
            <div className="w-40 aspect-video rounded-lg overflow-hidden bg-[#272727] flex-shrink-0">
              <img
                src={v.thumbnailUrl || `https://picsum.photos/seed/${v._id}/320/180`}
                alt={v.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${v._id}/320/180` }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium line-clamp-2">{v.title}</p>
              <p className="text-[#aaa] text-xs mt-1">{channel?.channelName}</p>
              <p className="text-[#aaa] text-xs">{formatViews(v.views)} views</p>
            </div>
          </Link>
        ))}
      </aside>
    </div>
  )
}