import { useEffect } from 'react';

const icons = {
  success: (
    <svg className="w-5 h-5 text-[#2e7d32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-[#d32f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

const styles = {
  success: 'bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]',
  error: 'bg-[#fce8e8] text-[#d32f2f] border border-[#f5c6cb]',
};

export default function Alert({ type = 'success', message, onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (!onDismiss || !duration) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!message) return null;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium animate-[slideDown_0.2s_ease-out] ${styles[type]}`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="opacity-60 hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
