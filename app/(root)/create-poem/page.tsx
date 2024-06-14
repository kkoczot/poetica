import CreatePoem from "@/components/forms/CreatePoem";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create poem</h1>
      <CreatePoem userId={JSON.parse(JSON.stringify(userInfo._id))} />
    </>
  )
}

export default Page;