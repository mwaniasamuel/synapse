import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Synapse - Cognitive Learning Acceleration Chrome Extension",
  description:
    "A Chrome extension that adapts to your cognitive patterns in real-time, optimizing content presentation and building personalized knowledge maps for enhanced learning.",
  keywords:
    "chrome extension, learning, education, cognitive science, browser extension, knowledge mapping, adaptive learning, focus enhancement",
  authors: [{ name: "Samuel Mwania", url: "https://github.com/samuel-mwania" }],
  openGraph: {
    title: "Synapse - Cognitive Learning Acceleration Chrome Extension",
    description: "A Chrome extension that adapts to your cognitive patterns in real-time for enhanced learning.",
    type: "website",
    locale: "en_US",
    siteName: "Synapse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synapse - Cognitive Learning Acceleration Chrome Extension",
    description: "A Chrome extension that adapts to your cognitive patterns in real-time for enhanced learning.",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  category: "Education",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
