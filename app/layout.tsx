import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{baseTheme: dark}}>
      <html lang="en" className="custom-scrollbar">
        {children}
      </html>
    </ClerkProvider>
  )
}