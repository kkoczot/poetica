"use client"

import { useAuth } from "@clerk/nextjs";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { countUnreadNotifs } from "@/lib/actions/notifs.actions";

function Bottombar() {
  const { userId } = useAuth();
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
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map(l => {
          if (!userId && l.route === "/profile") return;
          const isAcive = (pathname.includes(l.route) && l.route.length > 1) || pathname === l.route;
          if (l.route === "/profile") l.route = `${l.route}/${userId}`;
          return (
            <Link key={l.label} href={l.route} className={`${isAcive && "bg-green-600"} bottombar_link relative`}>
              {
                (l.label === "Notifications" && unreadCount) ? (<p
                  className="absolute top-1 left-[calc(50%+4px)] flex justify-center items-center bg-green-700 w-[18px] rounded-full text-small-regular aspect-square text-white"
                >{unreadCount}</p>) : null
              }
              <Image src={l.imgURL} alt={l.label} width={24} height={24} />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">{l.label.split(/\s+./)[0]}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default Bottombar;