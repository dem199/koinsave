import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  type = 'text',
  placeholder,
  disabled = false,
  icon: Icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      
      {error && (
        <p className="error-text">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;