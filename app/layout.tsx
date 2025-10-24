import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Bungee } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { GameProvider } from "@/lib/game-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _bungee = Bungee({ weight: "400", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Третий Глаз",
  description: "Виртуальный игровой стол",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <GameProvider>{children}</GameProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
