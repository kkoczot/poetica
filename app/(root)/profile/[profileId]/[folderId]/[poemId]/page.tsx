import PoemCardBtns from "@/components/interactiveElements/PoemCardBtns";
import NotFound from "@/components/shared/NotFound";
import { checkIfRightUser, fetchFolder } from "@/lib/actions/folder.actions";
import { checkIfRightFolder, fetchPoem } from "@/lib/actions/poem.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { profileId: string, folderId: string, poemId: string } }) => {
  const user = await currentUser();
  let own = false;
  if (user) {
    const authUser = await fetchUser(user.id);
    if (!authUser.onboarded) redirect("/onboarding");
    if (user.id === params.profileId) own = true;
  }

  const rightUser = await checkIfRightUser(params.folderId, params.profileId);
  const rightFolder = await checkIfRightFolder(params.poemId, params.folderId);
  if (!rightFolder || !rightUser) return <NotFound />;
  
  const poemData = await fetchPoem(params.poemId);
  const { username } = await fetchUser(params.profileId);
  const { title, shared, authorId } = await fetchFolder(params.folderId);

  if (!own && !shared) redirect("/sign-in");

  return (
    <section className="flex flex-col gap-6">
      <div>
        <div>
          <p className="text-light-2">
            Author:
            <Link href={`/profile/${params.profileId}/`} className="hover:opacity-80">
              {" @"+username}
            </Link> <span className="max-sm:hidden">|</span><br className="sm:hidden" /> Folder: 
            <Link href={`/profile/${params.profileId}/${params.folderId}/`} className="hover:opacity-80">
            {" "+title}
            </Link> | {!shared && "not"} shared | likes: {poemData.favourite.length}
          </p>
          <div className="flex gap-4 text-light-2 max-w-[325px] my-4">
            <PoemCardBtns authorId={JSON.parse(JSON.stringify(poemData.authorId))} folderId={JSON.parse(JSON.stringify(poemData.folderId))} poemId={params.poemId} own={own} toDisplay={{ edit: true, del: true, move: true }} />
          </div>
        </div>
        <h1 className="head-text">{poemData.title}</h1>
        <p className="text-light-2">Type: {poemData.type}</p>
      </div>
      <p className="text-light-2 whitespace-break-spaces">{poemData.content}</p>
    </section>
  )
}

export default Page;