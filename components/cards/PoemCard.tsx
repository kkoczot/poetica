import { fetchPoem } from "@/lib/actions/poem.actions";
import { handleLike } from "@/lib/actions/poem.actions";
import Link from "next/link";
import PoemCardBtns from "../interactiveElements/PoemCardBtns";
import HandleLikeBtn from "../interactiveElements/HandleLikeBtn";

async function PoemCard({ poemId, own, pathname, authUserId }: { poemId: string, own: boolean, pathname: string, authUserId: string | undefined }) {
  const poemData = await fetchPoem(poemId);
  const liked = await handleLike(authUserId, poemId, "check");

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-dark-3 p-4 max-w-full max-xl:max-w-[400px] max-sm:max-w-full  m-auto text-light-2">
      <div className="flex gap-4 items-center justify-between">
        <div>
          <h4 className="italic text-[18px]">{poemData.title}</h4>
          <h5 className="text-[14px] opacity-75">Type: {poemData.type}</h5>
        </div>
        <HandleLikeBtn authUserId={authUserId} poemId={poemId} length={poemData.favourite.length} liked={liked} />
      </div>
      <div>
        <Link href={`${pathname}/${poemId}`}>
          <p className="whitespace-nowrap text-ellipsis overflow-hidden">{poemData.content}</p>
        </Link>
      </div>
      <div className="flex gap-4 justify-around">
        <PoemCardBtns authorId={JSON.parse(JSON.stringify(poemData.authorId))} folderId={JSON.parse(JSON.stringify(poemData.folderId))} poemId={poemId} own={own} toDisplay={{ show: true, edit: true, del: true }} />
      </div>
    </div>
  )
}

export default PoemCard;