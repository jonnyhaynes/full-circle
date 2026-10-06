import type { ReactNode } from 'react'
import { Bebas_Neue, Comfortaa, Jost, Mrs_Saint_Delafield } from 'next/font/google'

/*
 * All four faces are self-hosted by next/font (no request reaches Google at
 * runtime). Display + numbers use Bebas, everything readable uses Jost (also
 * the live site's body font), the one script line per hero uses Mrs Saint
 * Delafield, and Comfortaa is used for the logo wordmark only.
 */
const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const mrs = Mrs_Saint_Delafield({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mrs',
  display: 'swap',
})

const comfortaa = Comfortaa({
  subsets: ['latin'],
  variable: '--font-comfortaa',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      className={`${bebas.variable} ${jost.variable} ${mrs.variable} ${comfortaa.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}
