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
      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}
      >
        {/* Progress bar */}
        <div
          className="w-full h-1.5 rounded cursor-pointer mb-3 relative"
          style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
          onClick={handleSeek}
        >
          <div
            className="h-full bg-red-600 rounded relative"
            style={{ width: `${progress}%` }}
          >
            {/* scrubber dot */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-md" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            style={{ color: '#ffffff' }}
            className="hover:scale-110 transition-transform"
          >
            {playing ? <MdPause className="text-2xl" /> : <MdPlayArrow className="text-2xl" />}
          </button>
        
          {/* Mute / Unmute */}
          <button
            onClick={toggleMute}
            style={{ color: '#ffffff' }}
            className="hover:scale-110 transition-transform"
          >
            {muted ? <MdVolumeOff className="text-xl" /> : <MdVolumeUp className="text-xl" />}
          </button>
        
          {/* Time display */}
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 500 }}>
            {Math.floor((videoRef.current?.currentTime || 0) / 60)}:
            {String(Math.floor((videoRef.current?.currentTime || 0) % 60)).padStart(2, '0')}
            {' / '}
            {Math.floor((videoRef.current?.duration || 0) / 60)}:
            {String(Math.floor((videoRef.current?.duration || 0) % 60)).padStart(2, '0')}
          </span>
        
          <div className="flex-1" />
        
          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            style={{ color: '#ffffff' }}
            className="hover:scale-110 transition-transform"
          >
            <MdFullscreen className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  )
}