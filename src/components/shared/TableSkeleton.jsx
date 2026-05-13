export default function TableSkeleton({ rows = 4, cols = 6 }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 overflow-hidden">
      <div className="bg-[#f8f8fc] border-b border-[#c6c6c8]/20 px-4 py-3.5">
        <div className="flex gap-8">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-3 bg-[#e8e8ed] rounded-full flex-1 animate-pulse" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className={`flex gap-8 px-4 py-4 ${r !== rows - 1 ? 'border-b border-[#c6c6c8]/20' : ''}`}>
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className={`h-3 bg-[#f0f0f5] rounded-full animate-pulse ${c === 0 ? 'flex-[2]' : 'flex-1'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
