import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { RouterProvider } from 'react-router-dom'
import Providers from './ui/provider'

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
        {/* <Providers> */}
          {children}
        {/* </Providers> */}
        </body>
    </html>
  )
}
