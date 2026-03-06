import { Link } from 'react-router-dom'
import { formatViews, timeAgo } from '../../utils/formatters'
import { useTheme } from '../../context/ThemeContext'

export default function VideoCard({ video }) {
  const channel = video.channelId
  const avatar = channel?.channelAvatar || `https://ui-avatars.com/api/?name=${channel?.channelName || 'C'}&background=random&color=fff`
  const thumbnail = video.thumbnailUrl || `https://picsum.photos/seed/${video._id}/640/360`
  const { darkMode } = useTheme()


  return (
    <Link to={`/video/${video._id}`} className="group flex flex-col cursor-pointer">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#272727]">
        <img
          src={thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${video._id}/640/360` }}
        />
        {video.duration && (
          <span className={`absolute bottom-1 right-1 text-xs px-1.5 py-0.5 rounded font-medium ${
              darkMode
                ? 'bg-black/80 text-white'
                : 'bg-white/70 text-black'
                }`}>
                {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex gap-3 mt-3">
        <img
          src={avatar}
          alt={channel?.channelName}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${channel?.channelName || 'C'}&background=random&color=fff` }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-sm font-medium line-clamp-2 leading-snug">
            {video.title}
          </h3>
          <p className="text-[#aaa] text-sm mt-1 hover:text-white transition-colors">
            {channel?.channelName || 'Unknown Channel'}
          </p>
          <p className="text-[#aaa] text-sm">
            {formatViews(video.views)} views • {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  )
}