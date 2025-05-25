import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Providers } from "@/components/providers"
import "@/app/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>RecipeShare - Share Your Culinary Journey</title>
        <meta
          name="description"
          content="Upload, discover, and learn from cooking videos shared by food enthusiasts around the world."
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
};
