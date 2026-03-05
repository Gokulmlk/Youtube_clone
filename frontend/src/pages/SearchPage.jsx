import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVideos } from '../store/slices/videoSlice'
import VideoCard from '../components/common/VideoCard'
import { VideoCardSkeleton } from '../components/common/Loader'
import { CATEGORIES } from '../utils/formatters'
import { MdSearch } from 'react-icons/md'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const dispatch = useDispatch()
  const { videos, loading } = useSelector(s => s.video)
  const [sortBy, setSortBy] = useState('createdAt')

  useEffect(() => {
    dispatch(fetchVideos({ search: query, sort: sortBy }))
  }, [query, sortBy, dispatch])

  return (
    <div className="px-4 py-6 max-w-5xl">
      <div className="flex items-center gap-2 mb-4">
        <MdSearch className="text-[#aaa] text-xl" />
        <h2 className="text-white font-semibold text-lg">
          {query ? `Results for "${query}"` : 'All videos'}
        </h2>
        {!loading && <span className="text-[#aaa] text-sm">({videos.length} videos)</span>}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[#aaa] text-sm">Sort by:</span>
        {['createdAt', 'views', 'likes'].map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === s ? 'bg-white text-black' : 'bg-[#272727] text-white hover:bg-[#3d3d3d]'
            }`}
          >
            {s === 'createdAt' ? 'Latest' : s === 'views' ? 'Most Viewed' : 'Most Liked'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-64 aspect-video rounded-xl bg-[#272727] flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2 pt-2">
                <div className="h-5 bg-[#272727] rounded w-3/4" />
                <div className="h-4 bg-[#272727] rounded w-1/2" />
                <div className="h-4 bg-[#272727] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20">
          <MdSearch className="text-[#aaa] text-6xl mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">No videos found</p>
          <p className="text-[#aaa] text-sm mt-2">Try different keywords</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {videos.map(video => (
            <div key={video._id} className="flex gap-4">
              <div className="w-64 flex-shrink-0">
                <VideoCard video={video} />
              </div>
              <div className="flex-1 pt-2 hidden sm:block">
                <h3 className="text-white font-medium text-base line-clamp-2">{video.title}</h3>
                <p className="text-[#aaa] text-sm mt-1">{video.channelId?.channelName}</p>
                <p className="text-[#aaa] text-sm">{video.category}</p>
                {video.description && (
                  <p className="text-[#aaa] text-sm mt-2 line-clamp-2">{video.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}