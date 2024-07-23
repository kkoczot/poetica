import SearchBtns from "@/components/shared/SearchBtns";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Poetica | Search",
  description: "A Next.js 14 Poetica app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-4xl">
      <SearchBtns />
      <Suspense fallback={<p className="text-white text-9xl">Loading...</p>}>
        {children}
      </Suspense>
    </div>
  );
}