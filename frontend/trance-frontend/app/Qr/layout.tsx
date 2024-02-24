import { Metadata } from "next"
import { Inter } from "next/font/google"
import { ToastContainer } from "react-toastify"


export const metadata: Metadata = {
  title: '2FA',
  description: 'Pong Platform 2FA Page',
}

export const viewport = {
  content: 'width=device-width, initial-scale=1'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
          {children}
        </body>
    </html>
  )
}