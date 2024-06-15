"use client"
import { sidebarLinks } from "@/constants";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function LeftSidebar() {
  const { userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map(l => {
          if (!userId && l.route === "/profile") return; // ogarnąć co wyświetlać kiedy user nie jest zalogowany tj. co wyświetlać anonom
          const isAcive = (pathname.includes(l.route) && l.route.length > 1) || pathname === l.route;
          if (l.route === "/profile") l.route = `${l.route}/${userId}`;
          return (
            <Link key={l.label} href={l.route} className={`${isAcive ? "bg-primary-500" : ""} leftsidebar_link`}>
              <Image src={l.imgURL} alt={l.label} width={24} height={24} />
              <p className="text-light-1 max-lg:hidden">{l.label}</p>
            </Link>
          )
        })}
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image src="/assets/logout.svg" alt="" width={24} height={24} />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}

export default LeftSidebar;