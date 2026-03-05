export default function Avatar({ src, name, size = 'md' }) {
  const sizes = { sm: 'w-6 h-6 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-20 h-20 text-2xl' }
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=random&color=fff`
  return (
    <img
      src={src || fallback}
      alt={name || 'Avatar'}
      className={`${sizes[size]} rounded-full object-cover flex-shrink-0`}
      onError={(e) => { e.target.src = fallback }}
    />
  )
}