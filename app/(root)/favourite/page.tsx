import FavouriteBtns from "@/components/shared/FavouriteBtns";
import FavouritePoems from "@/components/shared/FavouritePoems";
import { totalFetchLikedPoems } from "@/lib/actions/poem.actions";
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

  const likedPoemsData = await totalFetchLikedPoems(authUser.likes);
  const data = likedPoemsData.length > 0 && likedPoemsData.map(d => JSON.stringify(d));
  return (
    <section>
      <div>
        <h1 className="head-text">Favourite poems</h1>
        <h2 className="text-light-2 mb-10">You like {authUser.likes.length} poem(s)</h2>
        <FavouriteBtns />
      </div>
      <div>
        <FavouritePoems data={data ? JSON.stringify(data) : JSON.stringify([])} />
      </div>
    </section>
  )
}

export default Page;