import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AuthProvider } from "@/components/layout/auth-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { ConsentBanner } from "@/components/consent-banner"
import { BRAND } from "@/lib/brand"
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
  metadataBase: new URL("https://codecraft.techsci.xyz"),
  title: {
    default: `${BRAND.businessName} — Premium Digital Products`,
    template: `%s | ${BRAND.businessName}`,
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
    title: `${BRAND.businessName} - Premium Digital Products`,
    description:
      "Access premium digital products and growth tools designed to accelerate your business.",
    siteName: BRAND.businessName,
    images: [{ url: "/images/CODE_CRAFT_LOGO.png", width: 800, height: 800, alt: BRAND.businessName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.businessName} - Premium Digital Products`,
    description:
      "Access premium digital products and growth tools designed to accelerate your business.",
    images: ["/images/CODE_CRAFT_LOGO.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async
        />
        {/* GTM Consent Mode default — must run before GTM loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied'});`,
          }}
        />
        {/* Google Tag Manager — must be inline after consent default to preserve GDPR ordering */}
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
        <ConsentBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
