"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import HandleFollowBtn from "../interactiveElements/HandleFollowBtn";

function UserCarousel({ users, userId, follow }: { users: any[], userId: string, follow: "follow" | "unfollow" }) {
  const [current, setCurrent] = useState(1);
  if (!users.length) return (
    <p className="text-white text-center">No users to display</p>
  )
  if(current > users.length) setCurrent(1);
  return (
    <div className="flex gap-2">
      <button
        className={`text-white text-[24px] rounded-sm hover:bg-green-500/40 disabled:bg-green-700/15 ${current <= 1 ? "bg-green-700/15" : "bg-green-700/30"} ${users.length == 1 && "hidden"}`}
        disabled={current <= 1}
        onClick={() => setCurrent(prev => prev - 1)}
      >
        <Image src="/assets/left-arrow.svg" alt="show previous" width={12} height={12} />
      </button>
      <div key={users[current - 1]?.id} className="flex flex-col items-center flex-1">
        <Link href={`/profile/${users[current - 1]?.id}`}>
          <Image className="rounded-full block" src={users[current - 1]?.image} alt={users[current - 1]?.username} width={52} height={52} />
        </Link>
        <p className="text-white mt-2 mb-1">@{users[current - 1]?.username}</p>
        <span className="p-[2px] border border-transparent rounded-lg hover:border-white" onClick={() => {setCurrent(1)}}>
          <HandleFollowBtn authUserId={userId} userId={users[current - 1]?.id} follow={follow} />
        </span>
      </div>
      <button
        className={`text-white text-[24px] rounded-sm hover:bg-green-500/40 disabled:bg-green-700/15 ${current >= users.length ? "bg-green-700/15" : "bg-green-700/30"} ${users.length == 1 && "hidden"}`}
        disabled={current >= users.length}
        onClick={() => setCurrent(prev => prev + 1)}
      >
        <Image src="/assets/left-arrow.svg" alt="show next" width={12} height={12} className="rotate-180" />
      </button>
    </div>
  );
}

export default UserCarousel;