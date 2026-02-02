import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/components/layout/auth-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "TechSci CodeCraft - Premium Digital Products",
    template: "%s | TechSci CodeCraft",
  },
  description:
    "Access premium digital products and growth tools designed to accelerate your business.",
  keywords: [
    "digital products",
    "marketing tools",
    "business growth",
    "SaaS",
    "analytics",
  ],
  authors: [{ name: "TechSci, Inc." }],
  creator: "TechSci, Inc.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codecraft.techsci.xyz",
    title: "TechSci CodeCraft - Premium Digital Products",
    description:
      "Access premium digital products and growth tools designed to accelerate your business.",
    siteName: "TechSci CodeCraft",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechSci CodeCraft - Premium Digital Products",
    description:
      "Access premium digital products and growth tools designed to accelerate your business.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
