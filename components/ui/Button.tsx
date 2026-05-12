'use client'

import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
}

const classes: Record<Variant, string> = {
  primary:
    'bg-[#cc0000] text-white hover:bg-[#aa0000] active:bg-[#880000]',
  secondary:
    'border border-[#2d2d2d] text-[#2d2d2d] hover:bg-[#f5f5f5]',
  danger:
    'bg-red-700 text-white hover:bg-red-800',
  ghost:
    'text-[#2d2d2d] hover:bg-[#f5f5f5]',
}

export default function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed',
        classes[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
