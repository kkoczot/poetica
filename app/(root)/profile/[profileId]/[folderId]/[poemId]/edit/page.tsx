import EditPoem from "@/components/forms/EditPoem";
import NotFound from "@/components/shared/NotFound";
import { checkIfRightUser, fetchFolder, getAllUserFolders } from "@/lib/actions/folder.actions";
import { checkIfRightFolder, fetchPoem } from "@/lib/actions/poem.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { profileId: string, folderId: string, poemId: string } }) => {
  const { id: userId }:any = await currentUser();
  if (!userId) redirect("/sign-in");

  const { onboarded } = await fetchUser(userId);
  if (!onboarded) redirect("/onboarding");

  const rightUser = await checkIfRightUser(params.folderId, params.profileId);
  const rightFolder = await checkIfRightFolder(params.poemId, params.folderId);
  if (!rightUser || !rightFolder) return <NotFound />;
  
  const fetchedPoem = await fetchPoem(params.poemId);

  const folders = await getAllUserFolders(params.profileId);

  if (userId !== params.profileId) redirect(`/profile/${params.profileId}`);
  
  const poemData = {
    poemId: params.poemId,
    folderId: params.folderId,
    authorId: fetchedPoem.authorId,
    title: fetchedPoem.title,
    type: fetchedPoem.type,
    content: fetchedPoem.content,
  };

  return (
    <section>
      <h1 className="head-text mb-10">Edit Poem</h1>
      <EditPoem poem={JSON.parse(JSON.stringify(poemData))} profileId={params.profileId} folders={JSON.parse(JSON.stringify(folders))} />
    </section>
  )
}

export default Page;