import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import CreateFolder from "@/components/forms/CreateFolder";

async function Page() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id)
  // console.log("userInfo._id: ", userInfo._id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create folder</h1>
      <CreateFolder userId={JSON.parse(JSON.stringify(userInfo._id))} />
    </>
  )
}

export default Page;