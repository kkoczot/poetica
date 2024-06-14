import { Inter } from "next/font/google";
import "../globals.css";

export const metadata = {
  title: "Poetica | Auth",
  description: "A Next.js 14 Poetica app"
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <body className={`${inter.className} bg-dark-1`}>
      {children}
    </body>
  )
}