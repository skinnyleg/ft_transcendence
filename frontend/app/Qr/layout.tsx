import { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '2FA',
  description: 'Pong Platform 2FA Page',
  viewport: 'width=device-width, initial-scale=1',

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Providers> */}
          {children}
        {/* </Providers> */}
        </body>
    </html>
  )
}