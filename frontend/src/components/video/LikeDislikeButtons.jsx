import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from 'react-icons/ai'
import { likeVideo, dislikeVideo } from '../../store/slices/videoSlice'
import { toast } from 'react-toastify'

export default function LikeDislikeButtons({ video }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)

  const handleLike = async () => {
    if (!user) { toast.info('Please sign in to like videos'); navigate('/login'); return }
    await dispatch(likeVideo(video._id))
  }

  const handleDislike = async () => {
    if (!user) { toast.info('Please sign in to rate videos'); navigate('/login'); return }
    await dispatch(dislikeVideo(video._id))
  }

  const userLiked = user && video.likes?.includes(user._id)
  const userDisliked = user && video.dislikes?.includes(user._id)

  return (
    <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2 hover:bg-[#3d3d3d] transition-colors border-r border-[#3d3d3d] ${
          userLiked ? 'text-blue-400' : 'text-white'
        }`}
      >
        {userLiked ? <AiFillLike className="text-xl" /> : <AiOutlineLike className="text-xl" />}
        <span className="text-sm font-medium">{video.likeCount || video.likes?.length || 0}</span>
      </button>
      <button
        onClick={handleDislike}
        className={`flex items-center gap-2 px-4 py-2 hover:bg-[#3d3d3d] transition-colors ${
          userDisliked ? 'text-red-400' : 'text-white'
        }`}
      >
        {userDisliked ? <AiFillDislike className="text-xl" /> : <AiOutlineDislike className="text-xl" />}
        <span className="text-sm font-medium">{video.dislikeCount || video.dislikes?.length || 0}</span>
      </button>
    </div>
  )
}