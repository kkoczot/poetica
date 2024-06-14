import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if(!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user?.id,
    objecId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo.image : user?.imageUrl,
  };

  return (
    <section>
      <h1 className="head-text mb-10">Edit profile</h1>
      <AccountProfile user={JSON.parse(JSON.stringify(userData))} btnTitle="Edit" />
    </section>
  )
}

export default Page;