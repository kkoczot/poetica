import { fetchUser, suggestedAuthors } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  function resultAuthorCard(type: "amount" | "fame" | "similar", author: any[], error?: { occured: boolean, title: string, message: string }) {
    if (error?.occured) return (
      <div className="bg-dark-3 flex flex-col w-[280px] items-center px-2 py-4 rounded-lg">
        <h3>{error.title}</h3>
        <p>!</p>
        <div className="w-5/6 h-[2px] bg-green-600 my-1 rounded-lg" />
        <p>{error.message}</p>
      </div>
    );
    return author?.map((author: any, i: number) => (
      <div key={author.id} className="bg-dark-3 flex flex-col w-[280px] items-center px-2 py-4 rounded-lg">
        <Link href={`/profile/${author.id}/`}><h3>@{author.username}</h3></Link>
        <div className="flex my-1 items-center">
          <p>{i + 1}.</p>
          <div className="">
            <Image className="ml-2 rounded-full" src={author.image} alt="user profile pic" height={32} width={32} />
          </div>
        </div>
        <div className="w-5/6 h-[2px] bg-green-600 my-1 rounded-lg" />
        {type === "amount" && <p>Poems: {author.poemsCount}</p>}
        {type === "fame" && <p>Followers: {author.followersCount}</p>}
        {type === "similar" && <p>Similar: {author.similarAuthors}</p>}
      </div>
    )
    )
  }

  function showAuthors(condition: "amount" | "fame" | "similar") {
    if (condition === "amount") {
      if (!amountAuthors.length) return resultAuthorCard("amount", [], { occured: true, title: "No amount authors found!", message: "Something went wrong!" });
      else return resultAuthorCard("amount", amountAuthors);
    }
    if (condition === "fame") {
      if (!fameAuthors.length) return resultAuthorCard("fame", [], { occured: true, title: "No fame authors found!", message: "Someting went wrong!" });
      else return resultAuthorCard("fame", fameAuthors);
    }
    if (condition === "similar") {
      if (!similarAuthors.length) return resultAuthorCard("similar", [], { occured: true, title: "No similar authors for you!", message: "Follow more authors!" });
      else return resultAuthorCard("similar", similarAuthors);
    }
  }

  const amountAuthors = await suggestedAuthors(user?.id, "amount");
  const fameAuthors = await suggestedAuthors(user?.id, "fame");
  const similarAuthors = await suggestedAuthors(user?.id, "similar");
  return (
    <section className="text-white text-[18px] w-full">
      <div>
        <h1 className="head-text mb-8">Authors suggested for you!</h1>
        <div className="mb-12">
          <h2>The most popular authors:</h2>
          <p className="text-subtle-medium italic mb-2">(that you don't followe yet)</p>
          <div className="flex gap-4 mt-2 overflow-x-auto pb-2 h-scroll-style"> 
            {
              showAuthors("fame")
            }
          </div>
        </div>
        <div className="mb-12">
          <h2>Authors of the largest number of poems:</h2>
          <p className="text-subtle-medium italic mb-2">(that you don't follow yet)</p>
          <div className="flex gap-4 mt-2 overflow-x-auto pb-2 h-scroll-style">
            {
              showAuthors("amount")
            }
          </div>
        </div>
        <div>
          <h2>Authors that you also should like:</h2>
          <p className="text-subtle-medium italic mb-2">(that you don't follow yet)</p>
          <div className="flex gap-4 mt-2 overflow-x-auto pb-2 h-scroll-style">
            {
              showAuthors("similar")
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page;