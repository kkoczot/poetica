"use client";

import { handleLike } from "@/lib/actions/poem.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  authUserId: string | undefined;
  poemId: string;
  length: string | number;
  liked: boolean | undefined;
}

function HandleLikeBtn({ authUserId, poemId, length, liked }: Props) {
  const router = useRouter();
  return (
    <button
      disabled={!authUserId}
      onClick={async () => {
        await handleLike(authUserId, poemId, "handle");
        // router.refresh();
      }}
      className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 text-light-2 disabled:bg-dark-4 hover:bg-dark-2"
    >
      <div className="flex gap-2">
        <Image src={liked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"} alt="heart" width={25} height={25} />
        <p>{length}</p>
      </div>
    </button>
  )
}

export default HandleLikeBtn;