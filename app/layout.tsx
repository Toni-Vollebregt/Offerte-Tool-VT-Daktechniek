import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VT Daktechniek — Offerte Tool',
  description: 'Snel en eenvoudig offertes maken voor uw dakdekkerswerkzaamheden.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
