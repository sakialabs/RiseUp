import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const inputStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-charcoal/20 focus:ring-solidarity-red focus:border-transparent';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-charcoal mb-2">
            {label}
            {props.required && <span className="text-solidarity-red ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${inputStyles} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-charcoal/60">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
