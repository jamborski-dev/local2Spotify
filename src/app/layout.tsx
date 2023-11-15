import { AuthProvider } from "@/context/AuthContext"
import "./globals.css"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"

const font = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AuthProvider>{children}</AuthProvider>
        <p>Hello world!</p>
      </body>
    </html>
  )
}
