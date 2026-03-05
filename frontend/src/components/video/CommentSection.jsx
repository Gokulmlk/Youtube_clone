import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { MdSend, MdEdit, MdDelete, MdClose, MdCheck } from 'react-icons/md'
import { toast } from 'react-toastify'
import API from '../../api/axios'
import { timeAgo } from '../../utils/formatters'
import Avatar from '../common/Avatar'

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const { user } = useSelector(s => s.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (videoId) fetchComments()
  }, [videoId])

  const fetchComments = async () => {
    try {
      const res = await API.get(`/videos/${videoId}/comments`)
      setComments(res.data.comments || [])
    } catch {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { toast.info('Please sign in to comment'); navigate('/login'); return }
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await API.post(`/videos/${videoId}/comments`, { text: text.trim() })
      setComments(prev => [res.data.comment, ...prev])
      setText('')
      toast.success('Comment added!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment')
    } finally { setLoading(false) }
  }

  const handleEdit = async (commentId) => {
    if (!editText.trim()) return
    try {
      const res = await API.put(`/videos/${videoId}/comments/${commentId}`, { text: editText.trim() })
      setComments(prev => prev.map(c => c._id === commentId ? res.data.comment : c))
      setEditingId(null)
      toast.success('Comment updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    }
  }

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return
    try {
      await API.delete(`/videos/${videoId}/comments/${commentId}`)
      setComments(prev => prev.filter(c => c._id !== commentId))
      toast.success('Comment deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    }
  }

  const startEdit = (comment) => {
    setEditingId(comment._id)
    setEditText(comment.text)
  }

  return (
    <div className="mt-6">
      <h3 className="text-white font-semibold text-lg mb-4">{comments.length} Comments</h3>

      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        {user
          ? <Avatar src={user.avatar} name={user.username} size="md" />
          : <div className="w-9 h-9 rounded-full bg-[#272727] flex-shrink-0" />
        }
        <div className="flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={user ? "Add a comment..." : "Sign in to comment"}
            disabled={!user}
            onClick={() => { if (!user) navigate('/login') }}
            className="w-full bg-transparent border-b border-[#3d3d3d] focus:border-white text-white text-sm py-1 outline-none placeholder-[#aaa] disabled:cursor-pointer transition-colors"
          />
          {text && (
            <div className="flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setText('')} className="text-[#aaa] hover:text-white px-3 py-1.5 rounded-full text-sm transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1">
                <MdSend className="text-sm" /> Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments list */}
      <div className="flex flex-col gap-4">
        {comments.map((comment) => {
          const isOwner = user && (user._id === comment.userId?._id || user._id === comment.userId)
          return (
            <div key={comment._id} className="flex gap-3">
              <Avatar src={comment.userId?.avatar} name={comment.userId?.username} size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-sm font-medium">{comment.userId?.username || 'User'}</span>
                  <span className="text-[#aaa] text-xs">{timeAgo(comment.createdAt)}</span>
                </div>

                {editingId === comment._id ? (
                  <div className="flex gap-2 items-start">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 bg-transparent border-b border-white text-white text-sm py-1 outline-none"
                      autoFocus
                    />
                    <button onClick={() => handleEdit(comment._id)} className="text-blue-400 hover:text-blue-300 p-1"><MdCheck /></button>
                    <button onClick={() => setEditingId(null)} className="text-[#aaa] hover:text-white p-1"><MdClose /></button>
                  </div>
                ) : (
                  <p className="text-[#f1f1f1] text-sm leading-relaxed">{comment.text}</p>
                )}

                {isOwner && editingId !== comment._id && (
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => startEdit(comment)} className="text-[#aaa] hover:text-white p-1 rounded transition-colors">
                      <MdEdit className="text-sm" />
                    </button>
                    <button onClick={() => handleDelete(comment._id)} className="text-[#aaa] hover:text-red-400 p-1 rounded transition-colors">
                      <MdDelete className="text-sm" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}