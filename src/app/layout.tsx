import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import Navbar from '@/shared/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <Navbar>
            {children}
          </Navbar>
        </Providers>
      </body>
    </html>
  )
}
