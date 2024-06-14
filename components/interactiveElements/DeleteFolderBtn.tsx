"use client";

import { deleteFolder } from "@/lib/actions/folder.actions";
import { useRouter } from "next/navigation";

interface Props {
  authorId: string;
  folderId: string;
}

function DeleteFolderBtn({ authorId, folderId }: Props) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        if (window.confirm("Do you want to delete this folder? Poem inside this folder will be placed in undeletable Working folder")) {
          await deleteFolder(authorId, folderId);
          router.push(`/profile/${authorId}`);
        }
      }}
      className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 text-red-500"
    >
      Delete
    </button>
  )
}

export default DeleteFolderBtn;