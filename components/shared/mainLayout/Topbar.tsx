import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton, UserProfile } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function Topbar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Poetica</p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer" title="Log out">
                <Image src="/assets/logout.svg" alt="log out" width={24} height={24} />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <div>
          <SignedOut>
            <SignInButton>
              <div className="flex cursor-pointer h-[24px] w-[24px" title="log in">
                <Image src="/assets/login.svg" alt="Log in" width={24} height={24} />
              </div>
            </SignInButton>
          </SignedOut>
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </nav>
  )
}

export default Topbar;