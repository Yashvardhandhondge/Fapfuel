import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FapFuel',
  description: 'fapfuel',
  generator: 'v0.dev',
  icons: {
    icon: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m7 16.3 2.2-5.9a7.85 7.85 0 0 1 1.1-1.9c.6-.8 1.3-1.5 2.1-2.1C15.8 4.1 20.5 3.3 21 8c.3 3.2-1.8 6.4-4.7 8.3L12 20.7a1 1 0 0 1-2.4-.7 3 3 0 0 1 .9-2.2L16 12.4C16.8 11.6 17 10.4 16.5 9.5c-.4-.7-1.2-1-1.9-.8-.6.2-1.1.7-1.5 1.3L9.7 15.2c-.4.8-.7 1.7-.9 2.6-.1.5-.1 1-.1 1.5v.2'/></svg>",
      type: "image/svg+xml",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
