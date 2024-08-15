// Suggested Users: trzy wiersze z sugestiami kogo followołać
// 1'szy wiersz: osoby z największą ilością follołersów
// 2'gi wiersz: osoby, które napisały (i udostępniają) najwięcej wierszy

import { suggestedAuthors } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

// 3'ci wiersz: osoby, które są follołowane przez osoby follołowane przez usera
const Page = async () => {
  const user = await currentUser();
  console.log(user?.id)
  // if(!user) redirect("/sign-in");

  // const userInfo = await fetchUser(user.id);
  // if(userInfo?.onboarded) redirect("/");

  function showAuthors(condition: "amount" | "fame" | "similar") {
    if (condition === "amount") {
      return amountAuthors?.map((author: any, i: number) => (
        <div key={author.id} className="bg-dark-3 flex flex-col w-[280px] items-center px-2 py-4 rounded-lg">
          <Link href={`/profile/${author.id}/`}><h3>@{author.username}</h3></Link>
          <p>{i+1}.</p>
          <div className="w-5/6 h-[2px] bg-green-600 my-1 rounded-lg" />
          <p>Poems: {author.poemsCount}</p>
        </div>
      ));
    }
    if (condition === "fame") {
      return fameAuthors?.map((author: any, i: number) => (
        <div key={author.id} className="bg-dark-3 flex flex-col w-[280px] items-center px-2 py-4 rounded-lg">
          <Link href={`/profile/${author.id}/`}><h3>@{author.username}</h3></Link>
          <p>{i+1}.</p>
          <div className="w-5/6 h-[2px] bg-green-600 my-1 rounded-lg" />
          <p>Followers: {author.followersCount}</p>
        </div>
      ));
    }
    if (condition === "similar") {
      if (!similarAuthors.length) return (
        <div className="bg-dark-3 flex flex-col w-[280px] items-center px-2 py-4 rounded-lg">
          <h3>No similar authors for you!</h3>
          <p>0</p>
          <div className="w-5/6 h-[2px] bg-green-600 my-1 rounded-lg" />
          <p>Follow other authors!</p>
        </div>
      )
      return similarAuthors?.map((author: any, i: number) => (
        <div key={author.id} className="bg-dark-3 flex flex-col w-[280px] items-center px-2 py-4 rounded-lg">
          <Link href={`/profile/${author.id}/`}><h3>@{author.username}</h3></Link>
          <p>{i+1}.</p>
          <div className="w-5/6 h-[2px] bg-green-600 my-1 rounded-lg" />
          <p>Similar: {author.poemsCount}</p>
        </div>
      ));
    }
  }
  
  const amountAuthors = await suggestedAuthors(user?.id, "amount");
  const fameAuthors = await suggestedAuthors(user?.id, "fame");
  const similarAuthors = await suggestedAuthors(user?.id, "similar");
  return (
    <section className="text-white text-[18px]">
      <h1 className="head-text mb-10">Authors suggested for you!</h1>
      <div className="mb-12">
        <h2>The most popular authors:</h2>
        <div className="flex gap-4 mt-2">
          {
            showAuthors("fame")
          }
        </div>
      </div>
      <div className="mb-12">
        <h2>Authors of the largest number of poems:</h2>
        <div className="flex gap-4 mt-2">
          {
            showAuthors("amount")
          }
        </div>
      </div>
      <div className="mb-12">
        <h2>Authors that you also should like:</h2>
        <div className="flex gap-4 mt-2">
          {
            showAuthors("similar")
          }
        </div>
      </div>
    </section>
  )
}

export default Page;