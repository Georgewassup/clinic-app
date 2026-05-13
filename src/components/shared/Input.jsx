import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className={className}>
    {label && (
      <label className="block text-[15px] font-semibold text-[#3a3a3c] mb-1.5">
        {label}
      </label>
    )}
    <input
      ref={ref}
      {...props}
      className={`w-full px-3.5 py-2.5 bg-[#f8f8fc] rounded-xl text-[15px] text-[#1c1c1e] placeholder-[#8e8e93] border transition-all duration-150
        ${error
          ? 'border-[#ff3b30] focus:border-[#ff3b30] focus:ring-1 focus:ring-[#ff3b30]/30'
          : 'border-[#c6c6c8]/30 focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30'
        }
        ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        outline-none`}
    />
    {error && <p className="mt-1 text-[13px] text-[#ff3b30] font-medium">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
