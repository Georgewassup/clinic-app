export default function Select({ label, error, options = [], placeholder, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[15px] font-semibold text-[#3a3a3c] mb-1.5">{label}</label>
      )}
      <select
        {...props}
        className={`w-full px-3.5 py-2.5 bg-[#f8f8fc] rounded-xl text-[15px] text-[#1c1c1e] border transition-all duration-150 appearance-none
          ${error ? 'border-[#ff3b30]' : 'border-[#c6c6c8]/30'}
          outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30
          ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${props.value ? '' : 'text-[#8e8e93]'}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238e8e93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '36px',
        }}
      >
        {placeholder && <option value="" disabled hidden>{placeholder}</option>}
        {placeholder && <option value=""></option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-[13px] text-[#ff3b30] font-medium">{error}</p>}
    </div>
  );
}
