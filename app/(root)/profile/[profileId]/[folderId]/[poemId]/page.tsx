import PoemCardBtns from "@/components/interactiveElements/PoemCardBtns";
import { fetchFolder } from "@/lib/actions/folder.actions";
import { fetchPoem } from "@/lib/actions/poem.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { profileId: string, folderId: string, poemId: string } }) => {
  const user = await currentUser();
  let own = false;
  if (user) {
    const authUser = await fetchUser(user.id);
    if (!authUser.onboarded) redirect("/onboarding");
    if (user.id === params.profileId) own = true;
  }

  const poemData = await fetchPoem(params.poemId);
  const { username } = await fetchUser(params.profileId);
  const { title, shared, authorId } = await fetchFolder(params.folderId);

  if(!own && !shared) redirect("/sign-in");

  return (
    <section className="flex flex-col gap-6">
      <div>
        <div>
          <p className="text-light-2">Author: {username} | Folder: {title} | {!shared && "not"} shared | likes: {poemData.favourite.length}</p>
          <div className="flex gap-4 text-light-2">
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