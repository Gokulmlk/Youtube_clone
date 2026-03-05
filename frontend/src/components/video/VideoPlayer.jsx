import { useRef, useState } from 'react'
import { MdPlayArrow, MdPause, MdVolumeUp, MdVolumeOff, MdFullscreen } from 'react-icons/md'

export default function VideoPlayer({ videoUrl, thumbnailUrl, title }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) { videoRef.current.pause(); setPlaying(false) }
    else { videoRef.current.play(); setPlaying(true) }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const p = (videoRef.current.currentTime / videoRef.current.duration) * 100
    setProgress(isNaN(p) ? 0 : p)
  }

  const handleSeek = (e) => {
    if (!videoRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = x / rect.width
    videoRef.current.currentTime = pct * videoRef.current.duration
  }

  const handleFullscreen = () => {
    if (videoRef.current) videoRef.current.requestFullscreen()
  }

  // Check if it's an embed URL (YouTube)
  const isEmbed = videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be')

  if (isEmbed) {
    const embedUrl = videoUrl.includes('embed')
      ? videoUrl
      : `https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop()}`
    return (
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    )
  }

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative group">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
      />

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress bar */}
        <div className="w-full h-1 bg-white/30 rounded cursor-pointer mb-3" onClick={handleSeek}>
          <div className="h-full bg-red-600 rounded" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="text-white hover:text-red-400 transition-colors">
            {playing ? <MdPause className="text-2xl" /> : <MdPlayArrow className="text-2xl" />}
          </button>
          <button onClick={toggleMute} className="text-white hover:text-red-400 transition-colors">
            {muted ? <MdVolumeOff className="text-xl" /> : <MdVolumeUp className="text-xl" />}
          </button>
          <div className="flex-1" />
          <button onClick={handleFullscreen} className="text-white hover:text-red-400 transition-colors">
            <MdFullscreen className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  )
}