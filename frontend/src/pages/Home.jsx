import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVideos } from '../store/slices/videoSlice'
import VideoCard from '../components/common/VideoCard'
import CategoryFilter from '../components/common/CategoryFilter'
import { VideoCardSkeleton } from '../components/common/Loader'

export default function Home() {
  const dispatch = useDispatch()
  const { videos, loading, error } = useSelector(s => s.video)
  const [category, setCategory] = useState('All')

  useEffect(() => {
    const params = category === 'All' ? {} : { category }
    dispatch(fetchVideos(params))
  }, [category, dispatch])

  return (
    <div>
      <CategoryFilter selected={category} onSelect={setCategory} />
      <div className="px-4 pb-8">
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-3">{error}</p>
            <button onClick={() => dispatch(fetchVideos({}))} className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium">
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: 12 }).map((_, i) => <VideoCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {videos.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="text-[#aaa] text-lg">No videos found for this category</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {videos.map(video => <VideoCard key={video._id} video={video} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}