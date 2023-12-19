import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { socket , socketContext} from './context/soketContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Login',
  description: 'Pong Platform Login Page',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head >
        <link rel='icon' href='/logo.png' />
      </head>
      <body className={inter.className}>
          {children}
        </body>
    </html>
  )
}
