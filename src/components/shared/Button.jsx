export default function Button({ variant = 'primary', children, className = '', loading, ...props }) {
  const base = 'px-5 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-150 inline-flex items-center justify-center gap-2 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-[#007AFF] text-white hover:bg-[#0066d6] shadow-sm',
    danger: 'bg-[#ff3b30] text-white hover:bg-[#d32f2f] shadow-sm',
    secondary: 'bg-[#e5e5ea] text-[#3a3a3c] hover:bg-[#d1d1d6]',
    ghost: 'bg-transparent text-[#007AFF] hover:bg-[#007AFF]/10',
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
