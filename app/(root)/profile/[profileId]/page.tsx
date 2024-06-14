import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, checkUserFollow } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ProfileFolders from "@/components/shared/ProfileFolders";

const Page = async ({ params }: { params: { profileId: string } }) => {
  const user = await currentUser();
  if (user) {
    const authUser = await fetchUser(user.id);
    if (user && !authUser.onboarded) redirect("/onboarding");
  }

  let follow = undefined;

  const { bio, name, username, image, id, followers, following } = await fetchUser(params.profileId);

  if (user && user.id !== id) {
    follow = await checkUserFollow(user.id, id) ? "unfollow" : "follow";
  }

  return (
    <>
      <ProfileHeader
        accountId={id}
        authUserId={user?.id || "xd"}
        name={name}
        username={username}
        image={image}
        bio={bio}
        follow={follow}
        followers={followers.length}
        following={following.length}
      />
      <ProfileFolders accountId={id} authUserId={user?.id || "xd"} />
    </>
  )
}

export default Page;