import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Topbar from "@/components/shared/mainLayout/Topbar";
import LeftSidebar from "@/components/shared/mainLayout/LeftSidebar";
import RightSidebar from "@/components/shared/mainLayout/RightSidebar";
import Bottombar from "@/components/shared/mainLayout/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poetica",
  description: "A Next.js 14 Poetica app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <body className={inter.className}>
      <Topbar />
      <main className="flex flex-row">
        <LeftSidebar />
        <section className="main-container overflow-x-hidden">
          <div className="w-full max-w-4xl">
            {/* <Suspense fallback={<p className="text-white text-9xl">Loading...</p>}>
              {children}
            </Suspense> */}
            {children}
          </div>
        </section>
        <RightSidebar />
      </main>
      <Bottombar />
    </body>
  );
}