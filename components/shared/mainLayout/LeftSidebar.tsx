"use client"
import { sidebarLinks } from "@/constants";
import { countUnreadNotifs } from "@/lib/actions/notifs.actions";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function LeftSidebar() {
  const { userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [initialStart, setInitialStart] = useState(true);

  useEffect(() => {
    async function getUnreadNotifs() {
      try {
        console.log(" ----> Function fired!")
        const count = await countUnreadNotifs(userId || null);
        setUnreadCount(() => count);
      } catch (error: any) {
        throw new Error("Failed to get unread notifs count");
      }
    }
    if (initialStart && !pathname.includes("/notifications")) {
      getUnreadNotifs();
      setInitialStart(false);
    }
    if (pathname.includes("/notifications")) {
      getUnreadNotifs();
      setInitialStart(true);
    }
  }, [pathname, initialStart]);

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map(l => {
          if (!userId && l.route === "/profile") return; // ogarnąć co wyświetlać kiedy user nie jest zalogowany tj. co wyświetlać anonom
          const isAcive = (pathname.includes(l.route) && l.route.length > 1) || pathname === l.route;
          if (l.route === "/profile") l.route = `${l.route}/${userId}`;
          return (
            <Link key={l.label} href={l.route} className={`${isAcive ? "bg-green-600" : ""} leftsidebar_link relative`}>
              {
                (l.label === "Notifications" && unreadCount) ? (<p
                  className="absolute top-1 left-7 flex justify-center items-center bg-green-700 w-[18px] rounded-full text-small-regular aspect-square text-white"
                >{unreadCount}</p>) : null
              }
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