import FavouriteBtns from "@/components/shared/FavouriteBtns";
import FavouritePoems from "@/components/shared/FavouritePoems";
import { totalFetchLikedPoems } from "@/lib/actions/poem.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
// Wyświetla polubione wiersze
const Page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const authUser = await fetchUser(user.id);
  if (user && !authUser.onboarded) redirect("/onboarding");
  
  console.log("authUser.likes: ", authUser.likes);

  const likedPoemsData = await totalFetchLikedPoems(authUser.likes);
  const data = likedPoemsData.map(d => JSON.stringify(d));

  return (
    <section>
      <div>
      <p className="text-white">
        Zastanowić się w jaki sposób zrobić tę stronę, tj:<br />
        - W jaki sposób w ogóle wyświetlić dane? grid, flex, ramki dla konkretnych wierszy itp.<br />
        - Czy wyświetlać całe wiersze czy tylko kawałek do ewentualnego rozwinięcia albo otawrcia na innej stronie<br />
        - Czy dodać jakieś elementy filtrowania czego się szuka (typ wiersza, autor wiersza)<br />
        - Czy dodać jakieś elementy wyszukiwana (autora wiersza, frazy w wierszu)<br />
        - System paginacji

      <br /><br />
        - Pobrać jakie wiersze lubi user - stworzyć funkcję by pobrać odpowiednie dane i przekazać je dalej do mapowania do {'<FavouritePoems />'}
      <br /><br />
      </p>
        <h1 className="head-text">Favourite poems</h1>
        <h2 className="text-light-2 mb-10">You like { } poems</h2>
        <div>
          <FavouriteBtns />
        </div>
      </div>
      <div>
        { likedPoemsData && <FavouritePoems data={JSON.stringify(data)} />}
      </div>
    </section>
  )
}

export default Page;