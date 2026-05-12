'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-[#2d2d2d]">{label}</label>
        )}
        <input
          ref={ref}
          className={[
            'rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-[#1a1a1a] min-h-[44px]',
            'focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error ? 'border-red-500' : '',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export default Input
