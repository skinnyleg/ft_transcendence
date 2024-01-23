import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'
import { socket , socketContext} from './context/soketContext'
import { ToastContainer } from 'react-toastify'

const bebas_neue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  style: 'normal',
  
})

export const metadata: Metadata = {
  title: 'Login',
  description: 'Pong Platform Login Page',
}

export const viewport = {
  content: 'width=device-width, initial-scale=1'
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
      <body className={bebas_neue.className}>
        {children}
      </body>
    </html>
  )
}
