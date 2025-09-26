import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: 'NEXUS Analytics • Real-time Sports Intelligence',
  description: 'Advanced real-time sports analytics and insights powered by AI and machine learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-space">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}