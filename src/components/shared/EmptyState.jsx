export default function EmptyState({ title = 'No data yet', message = 'Get started by adding your first entry.', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-16 h-16 rounded-full bg-[#e8e8ed] flex items-center justify-center mb-5">
        <svg className="w-7 h-7 text-[#8e8e93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-[18px] font-semibold text-[#1c1c1e] mb-1">{title}</h3>
      <p className="text-[15px] text-[#8e8e93] text-center max-w-[280px] mb-5">{message}</p>
      {action}
    </div>
  );
}
