import HandleFollowBtn from "@/components/interactiveElements/HandleFollowBtn";
import { fetchFollowedAuthors, fetchSimilarAuthors } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;
  const similarAuthors = await fetchSimilarAuthors(user.id) || [];
  const followedAuthors = await fetchFollowedAuthors(user.id) || [];
  // console.log("user: ", user);
  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="felx flex-1 felx-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Authors for you:</h3>
        <div className="flex flex-col gap-4 divide-y-2 border-b-2 pb-4 border-white">
          {
            similarAuthors?.map(author => {
              return (
                <div key={author.id} className="flex flex-col items-center">
                  <Link href={`/profile/${author.id}`}>
                    <Image className="rounded-full block" src={author.image} alt={author.username} width={64} height={64} />
                  </Link>
                  <p className="text-white mt-2 mb-1">@{author.username}</p>
                  <span className="hover:bg-dark-1 p-[2px] rounded-lg">
                  <HandleFollowBtn authUserId={user.id} userId={author.id} follow="follow" />
                  </span>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="felx flex-1 felx-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Followed Authors:</h3>
        <div className="flex flex-col gap-4 divide-y-2 border-b-2 pb-4 border-white">
          {
            followedAuthors?.map(author => {
              return (
                <div key={author.id} className="flex flex-col items-center">
                  <Link href={`/profile/${author.id}`}>
                    <Image className="rounded-full block" src={author.image} alt={author.username} width={64} height={64} />
                  </Link>
                  <p className="text-white mt-2 mb-1">@{author.username}</p>
                  <span className="hover:bg-dark-1 p-[2px] rounded-lg">
                  <HandleFollowBtn authUserId={user.id} userId={author.id} follow="unfollow" />
                  </span>
                </div>
              )
            })
          }
        </div>
      </div>
    </section>
  )
}

export default RightSidebar;