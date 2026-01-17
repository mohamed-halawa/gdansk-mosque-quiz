import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gdansk Mosque Quiz Portal',
  description: 'Test your knowledge with our quiz portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
