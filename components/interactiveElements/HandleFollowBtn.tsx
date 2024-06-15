"use client";

import { handleUserFollow } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

interface Props {
  authUserId: string;
  userId: string;
  follow?: string;
}

function HandleFollowBtn({ authUserId, userId, follow }: Props) {
  const router = useRouter();
  
  return (
    <button
      onClick={async () => {
        await handleUserFollow(authUserId, userId);
        router.refresh();
      }}
      className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 text-light-2 hover:bg-dark-2"
    >
      {follow}
    </button>
  )
}

export default HandleFollowBtn;