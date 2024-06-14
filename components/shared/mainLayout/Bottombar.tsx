"use client"

import { useAuth } from "@clerk/nextjs";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Bottombar() {
  const { userId } = useAuth();
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map(l => {
          if (!userId && l.route === "/profile") return;
          const isAcive = (pathname.includes(l.route) && l.route.length > 1) || pathname === l.route;
          if (l.route === "/profile") l.route = `${l.route}/${userId}`;
          return (
            <Link key={l.label} href={l.route} className={`${isAcive && "bg-primary-500"} bottombar_link`}>
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