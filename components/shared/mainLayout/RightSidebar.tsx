import HandleFollowBtn from "@/components/interactiveElements/HandleFollowBtn";
import { fetchFollowedAuthors, suggestedAuthors } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import UserCarousel from "../UserCarousel";

async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;
  const similarAuthors = await suggestedAuthors(user.id, "similar") || [];
  const followedAuthors = await fetchFollowedAuthors(user.id) || [];
  // console.log("user: ", user);
  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="felx flex-1 felx-col justify-start">
        <h3 className="text-heading4-medium text-light-1 mb-3">Authors for you:</h3>
        <div className="flex flex-col gap-4 divide-y-2 border-b-2 pb-4 border-white">
          {
            // similarAuthors?.map((author: any) => {
            //   return (
            //     <div key={author.id} className="flex flex-col items-center">
            //       <Link href={`/profile/${author.id}`}>
            //         <Image className="rounded-full block" src={author.image} alt={author.username} width={64} height={64} />
            //       </Link>
            //       <p className="text-white mt-2 mb-1">@{author.username}</p>
            //       <span className="hover:bg-dark-1 p-[2px] rounded-lg">
            //       <HandleFollowBtn authUserId={user.id} userId={author.id} follow="follow" />
            //       </span>
            //     </div>
            //   )
            // })
          }
          <UserCarousel users={JSON.parse(JSON.stringify(similarAuthors))} userId={user.id} follow="follow" />
        </div>
      </div>
      <div className="felx flex-1 felx-col justify-start">
        <h3 className="text-heading4-medium text-light-1 mb-3">Followed Authors:</h3>
        <div className="flex flex-col gap-4 divide-y-2 border-b-2 pb-4 border-white">
          {
            // followedAuthors?.map(author => {
            //   return (
            //     <div key={author.id} className="flex flex-col items-center">
            //       <Link href={`/profile/${author.id}`}>
            //         <Image className="rounded-full block" src={author.image} alt={author.username} width={64} height={64} />
            //       </Link>
            //       <p className="text-white mt-2 mb-1">@{author.username}</p>
            //       <span className="hover:bg-dark-1 p-[2px] rounded-lg">
            //       <HandleFollowBtn authUserId={user.id} userId={author.id} follow="unfollow" />
            //       </span>
            //     </div>
            //   )
            // })
          }
          <UserCarousel users={JSON.parse(JSON.stringify(followedAuthors))} userId={user.id} follow="unfollow" />
        </div>
      </div>
    </section>
  )
}

export default RightSidebar;