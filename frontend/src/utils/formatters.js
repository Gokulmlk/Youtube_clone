export const formatViews = (num) => {
  if (!num) return '0'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toString()
}

export const formatSubscribers = (num) => {
  if (!num) return '0'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M subscribers'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K subscribers'
  return num + ' subscribers'
}

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds)
    if (count >= 1) return `${count} ${i.label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export const CATEGORIES = [
  'All', 'Web Development', 'JavaScript', 'React', 'Python',
  'Data Structures', 'Machine Learning', 'Gaming', 'Music',
  'Information Technology', 'Server', 'Relaxation', 'Live', 'Spring Framework'
]