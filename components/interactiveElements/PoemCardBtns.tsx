"use client";

import { deletePoem } from "@/lib/actions/poem.actions";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  authorId: string;
  folderId: string;
  poemId: string;
  own: boolean;
  toDisplay: {
    show?: boolean;
    edit?: boolean;
    del?: boolean;
    move?: boolean;
  }
}

function PoemCardBtns({ authorId, folderId, poemId, own, toDisplay }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      {
        toDisplay.show && (
          <Link
            href={`${pathname}/${poemId}`}
            className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 hover:bg-dark-2 w-full justify-center"
          >
            Show
          </Link>
        )
      }
      {
        toDisplay.edit && own && (
          <Link
            href={pathname.includes(poemId) ? `${pathname}/edit` : `${pathname}/${poemId}/edit`}
            className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 hover:bg-dark-2 w-full justify-center"
          >
            Edit
          </Link>
        )
      }
      {
        toDisplay.del && own && (
          <button
            onClick={async () => {
              if (window.confirm("Do you want to delete this poem?")) {
                await deletePoem(poemId);
                router.refresh();
              }
            }}
            className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 text-red-500 hover:bg-dark-2 w-full justify-center"
          >
            Delete
          </button>
        )
      }
    </>
  )
}

export default PoemCardBtns;