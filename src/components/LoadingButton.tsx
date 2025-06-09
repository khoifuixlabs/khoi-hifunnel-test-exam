import React from 'react';

interface LoadingButtonProps {
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export default function LoadingButton({
  type = 'button',
  isLoading = false,
  disabled = false,
  onClick,
  children,
  loadingText,
  className = '',
  variant = 'primary',
}: LoadingButtonProps) {
  const baseClasses = `
    group relative w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `;

  const variantClasses = {
    primary: `
      border-transparent text-white bg-indigo-600 hover:bg-indigo-700
      disabled:hover:bg-indigo-600
    `,
    secondary: `
      border-gray-300 text-gray-700 bg-white hover:bg-gray-50
      disabled:hover:bg-white
    `,
  };

  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();
  const isDisabled = disabled || isLoading;

  return (
    <button type={type} disabled={isDisabled} onClick={onClick} className={finalClassName}>
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
