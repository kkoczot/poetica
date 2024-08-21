import { fetchUser, suggestedAuthors } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  console.log(user?.id)
  if(!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onboarded) redirect("/onboarding");

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
        <div className="flex h-9 items-center">
            <p>{i + 1}.</p>
            <div className="">
              <Image className="" src={author.image} alt="user profile pic" height={36} width={36} />
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
      // return amountAuthors?.map((author: any, i: number) => (
      //   <div key={author.id} className="bg-dark-3 flex flex-col w-[280px] items-center px-2 py-4 rounded-lg">
      //     <Link href={`/profile/${author.id}/`}><h3>@{author.username}</h3></Link>
      //     <div className="flex h-9 items-center">
      //       <p>{i + 1}.</p>
      //       <div className="">
      //         <Image className="" src={author.image} alt="user profile pic" height={36} width={36} />
      //       </div>
      //     </div>
      //     <div className="w-5/6 h-[2px] bg-green-600 my-1 rounded-lg" />
      //     <p>Poems: {author.poemsCount}</p>
      //   </div>
      return resultAuthorCard("amount", amountAuthors);
      
    }
    if (condition === "fame") {
      if (!fameAuthors.length) return resultAuthorCard("fame", [], {occured: true, title: "No fame authors found!", message: "Someting went wrong!"});
      //   return (
      //   <div className="bg-dark-3 flex flex-col w-[280px] items-center px-2 py-4 rounded-lg">
      //     <h3>No fame authors found!</h3>
      //     <p>0</p>
      //     <div className="w-5/6 h-[2px] bg-green-600 my-1 rounded-lg" />
      //     <p>Something went wrong!</p>
      //   </div>
      // )

      // return fameAuthors?.map((author: any, i: number) => (
      //   <div key={author.id} className="bg-dark-3 flex flex-col w-[280px] items-center px-2 py-4 rounded-lg">
      //     <Link href={`/profile/${author.id}/`}><h3>@{author.username}</h3></Link>
      //     <div className="flex h-9 items-center">
      //       <p>{i + 1}.</p>
      //       <div className="">
      //         <Image className="" src={author.image} alt="user profile pic" height={36} width={36} />
      //       </div>
      //     </div>
      //     <div className="w-5/6 h-[2px] bg-green-600 my-1 rounded-lg" />
      //     <p>Followers: {author.followersCount}</p>
      //   </div>
      // ));
      return resultAuthorCard("fame", fameAuthors);
    }
    if (condition === "similar") {
      if (!similarAuthors.length) return resultAuthorCard("similar", [], {occured: true, title: "No similar authors for you!", message: "Follow more authors!"});
      //   return (
      //   <div className="bg-dark-3 flex flex-col w-[280px] items-center px-2 py-4 rounded-lg">
      //     <h3>No similar authors for you!</h3>
      //     <p>0</p>
      //     <div className="w-5/6 h-[2px] bg-green-600 my-1 rounded-lg" />
      //     <p>Follow other authors!</p>
      //   </div>
      // )

      // return similarAuthors?.map((author: any, i: number) => (
      //   <div key={author.id} className="bg-dark-3 flex flex-col w-[280px] items-center px-2 py-4 rounded-lg">
      //     <Link href={`/profile/${author.id}/`}><h3>@{author.username}</h3></Link>
      //     <div className="flex h-9 items-center">
      //       <p>{i + 1}.</p>
      //       <div className="">
      //         <Image className="" src={author.image} alt="user profile pic" height={36} width={36} />
      //       </div>
      //     </div>
      //     <div className="w-5/6 h-[2px] bg-green-600 my-1 rounded-lg" />
      //     <p>Similar: {author.similarAuthors}</p>
      //   </div>
      // ));
      return resultAuthorCard("similar", similarAuthors);
    }
  }

  const amountAuthors = await suggestedAuthors(user?.id, "amount");
  const fameAuthors = await suggestedAuthors(user?.id, "fame");
  const similarAuthors = await suggestedAuthors(user?.id, "similar");
  return (
    <section className="text-white text-[18px] container">
      <h1 className="head-text mb-10">Authors suggested for you!</h1>
      <div className="mb-12">
        <h2>The most popular authors that you don't followe yet:</h2>
        <div className="flex gap-4 mt-2 overflow-x-auto max-w-full">
          {
            showAuthors("fame")
          }
        </div>
      </div>
      <div className="mb-12">
        <h2>Authors of the largest number of poems that you don't follow yet:</h2>
        <div className="flex gap-4 mt-2 overflow-x-auto">
          {
            showAuthors("amount")
          }
        </div>
      </div>
      <div className="mb-12">
        <h2>Authors that you also should like:</h2>
        <div className="flex gap-4 mt-2 overflow-x-auto">
          {
            showAuthors("similar")
          }
        </div>
      </div>
    </section>
  )
}

export default Page;