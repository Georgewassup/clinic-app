import { useEffect, useRef } from 'react';

export default function Modal({ open, onClose, title, children, wide }) {
  const overlayRef = useRef();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose?.(); }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full mx-4 max-h-[85vh] overflow-y-auto animate-[slideUp_0.2s_ease-out] ${wide ? 'max-w-2xl' : 'max-w-lg'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c6c6c8]/20">
          <h2 className="text-[18px] font-semibold text-[#1c1c1e]">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#f2f2f7] flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-[#8e8e93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
