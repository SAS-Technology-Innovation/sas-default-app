import { Geist_Mono, DM_Sans } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { SkipLink } from "@workspace/accessibility/components"
import { LiveRegion } from "@workspace/accessibility/components"
import { cn } from "@workspace/ui/lib/utils"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        dmSans.variable
      )}
    >
      <body>
        <SkipLink />
        <Providers>
          <main id="main-content">{children}</main>
        </Providers>
        <LiveRegion />
      </body>
    </html>
  )
}
