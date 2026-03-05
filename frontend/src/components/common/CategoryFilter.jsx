import { CATEGORIES } from '../../utils/formatters'

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-3 px-4">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
            selected === cat
              ? 'bg-white text-black'
              : 'bg-[#272727] text-white hover:bg-[#3d3d3d]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}