import { currentUser } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { fetchUser, checkUserFollow, checkIfUserExists } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ProfileFolders from "@/components/shared/ProfileFolders";
import NotFound from "@/components/shared/NotFound";
import { getTopThreePoemsType } from "@/lib/actions/poem.actions";

const Page = async ({ params }: { params: { profileId: string } }) => {
  const user = await currentUser();
  if (user) {
    const authUser = await fetchUser(user.id);
    if (user && !authUser.onboarded) redirect("/onboarding");
  }

  let follow = undefined;
  const exists = await checkIfUserExists(params.profileId);
  if (!exists) return <NotFound />;

  const { bio, name, username, image, id, followers, following } = await fetchUser(params.profileId);

  // const topThreeTypes = await 
  const topThree = await getTopThreePoemsType(id);

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
        topThree={topThree}
        followers={followers.length}
        following={following.length}
      />
      <ProfileFolders accountId={id} authUserId={user?.id || "xd"} />
    </>
  )
}

export default Page;