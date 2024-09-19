import EditFolder from "@/components/forms/EditFolder";
import NotFound from "@/components/shared/NotFound";
import { checkIfRightUser, fetchFolder } from "@/lib/actions/folder.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { profileId: string, folderId: string } }) => {
  const { id: userId }:any = await currentUser();
  if (!userId) redirect("/sign-in");

  const { onboarded } = await fetchUser(userId);
  if (!onboarded) redirect("/onboarding");

  const rightUser = await checkIfRightUser(params.folderId, params.profileId);
  if (!rightUser) return <NotFound />;

  const fetchedFolder = await fetchFolder(params.folderId);

  if (userId !== params.profileId) redirect(`/profile/${params.profileId}`);
  if (!fetchedFolder.deletable) redirect(`/profile/${params.profileId}/${params.folderId}/`);
  
  const folderData = {
    folderId: params.folderId,
    authorId: fetchedFolder.authorId,
    title: fetchedFolder.title,
    description: fetchedFolder.description,
    shared: fetchedFolder.shared,
  };

  return (
    <section>
      <h1 className="head-text mb-10">Edit Folder</h1>
      <EditFolder folder={JSON.parse(JSON.stringify(folderData))} userId={String(userId)} />
    </section>
  )
}

export default Page;