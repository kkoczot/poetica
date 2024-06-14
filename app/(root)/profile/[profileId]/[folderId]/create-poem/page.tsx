import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import CreatePoem from "@/components/forms/CreatePoem";
import { fetchFolder } from "@/lib/actions/folder.actions";

async function Page({ params }: { params: { profileId: string, folderId: string } }) {
  const { id: userId }:any = await currentUser();
  if (!userId) redirect("/sign-in");

  const { onboarded, _id } = await fetchUser(userId);
  if (!onboarded) redirect("/onboarding");

  if (userId !== params.profileId) redirect(`/profile/${params.profileId}`);

  return (
    <>
      <h1 className="head-text">Create poem</h1>
      <CreatePoem userId={JSON.parse(JSON.stringify(_id))} folderId={params.folderId} />
    </>
  )
}

export default Page;