export default function Loader({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0f0f0f] flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-[#3d3d3d] border-t-red-600 rounded-full animate-spin" />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-[#3d3d3d] border-t-red-600 rounded-full animate-spin" />
    </div>
  )
}

export function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-video rounded-xl bg-[#272727]" />
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-[#272727] flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 bg-[#272727] rounded w-full" />
          <div className="h-3 bg-[#272727] rounded w-2/3" />
          <div className="h-3 bg-[#272727] rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}
