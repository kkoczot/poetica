import FavouriteBtns from "@/components/shared/FavouriteBtns";
import FavouritePoems from "@/components/shared/FavouritePoems";
import { everyTypeLikedCountPoems, totalFetchLikedPoems } from "@/lib/actions/poem.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const authUser = await fetchUser(user.id);
  if (user && !authUser.onboarded) redirect("/onboarding");

  // console.log("authUser.likes: ", authUser.likes);

  const likedPoemsData = await totalFetchLikedPoems(user.id, authUser.likes); // authUser.likes
  const likedTypesAmount = await everyTypeLikedCountPoems(user.id, authUser.likes);
  const data = likedPoemsData.length > 0 && likedPoemsData.map(d => JSON.stringify(d));
  // console.log(" >>> data: ", likedPoemsData);
  return (
    <section>
      <div>
        <h1 className="head-text">Favourite poems</h1>
        <h2 className="text-light-2 mb-10">You like {authUser.likes.length} poem(s) | {likedPoemsData.length} of them are shared</h2>
        <FavouriteBtns amount={likedTypesAmount} />
      </div>
      <div>
        <FavouritePoems data={data ? JSON.stringify(data) : JSON.stringify([])} />
      </div>
    </section>
  )
}

export default Page;