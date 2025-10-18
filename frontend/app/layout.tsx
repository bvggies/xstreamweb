import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Xstream - Football Live Streaming',
  description: 'Watch live football matches with premium streaming quality. Subscribe now for unlimited access to live matches, scores, and highlights.',
  keywords: 'football, live streaming, sports, matches, premier league, champions league',
  authors: [{ name: 'Xstream Team' }],
  openGraph: {
    title: 'Xstream - Football Live Streaming',
    description: 'Watch live football matches with premium streaming quality',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-dark-900 text-white">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 football-bg">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #00B140',
            },
          }}
        />
      </body>
    </html>
  )
}
