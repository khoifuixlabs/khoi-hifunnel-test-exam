import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps {
  id: string;
  type?: 'text' | 'email' | 'password' | 'select' | 'textarea';
  placeholder?: string;
  label?: string;
  showLabel?: boolean;
  autoComplete?: string;
  error?: string;
  register: UseFormRegisterReturn;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

export default function FormInput({
  id,
  type = 'text',
  placeholder,
  label,
  showLabel = false,
  autoComplete,
  error,
  register,
  options,
  defaultValue,
  className = '',
  rows = 3,
  disabled = false,
}: FormInputProps) {
  // Use the same border radius for all input types for consistency
  const borderRadiusClass = 'rounded-md';

  const baseClasses = `
    appearance-none relative block w-full px-3 py-2 border
    ${error ? 'border-red-300' : 'border-gray-300'}
    placeholder-gray-500 text-gray-900 
    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm
    ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
    ${borderRadiusClass}
    ${className}
  `.trim();

  const selectClasses = `
    block w-full px-3 py-2 border
    ${error ? 'border-red-300' : 'border-gray-300'}
    bg-white shadow-sm 
    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black
    ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
    ${borderRadiusClass}
    ${className}
  `.trim();

  const textareaClasses = `
    appearance-none relative block w-full px-3 py-2 border
    ${error ? 'border-red-300' : 'border-gray-300'}
    placeholder-gray-500 text-gray-900
    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm
    ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
    ${borderRadiusClass}
    ${className}
  `.trim();

  return (
    <div className="mb-2">
      {showLabel && label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {!showLabel && label && (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}

      {type === 'select' ? (
        <select id={id} {...register} className={selectClasses} defaultValue={defaultValue || ''} disabled={disabled}>
          {options?.map((option) => (
            <option key={option.value} value={option.value} disabled={option.value === ''}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={id} rows={rows} className={textareaClasses} placeholder={placeholder} {...register} disabled={disabled} />
      ) : (
        <input id={id} type={type} autoComplete={autoComplete} className={baseClasses} placeholder={placeholder} {...register} disabled={disabled} />
      )}

      {error && <p className="mt-1 text-sm text-red-600 mb-3">{error}</p>}
    </div>
  );
}
