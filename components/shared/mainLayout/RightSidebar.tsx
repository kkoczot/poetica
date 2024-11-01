import HandleFollowBtn from "@/components/interactiveElements/HandleFollowBtn";
import { fetchFollowedAuthors, suggestedAuthors } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import UserCarousel from "../UserCarousel";

async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;
  const similarAuthors = await suggestedAuthors(user.id, "similar", 5) || [];
  const followedAuthors = await fetchFollowedAuthors(user.id) || [];
  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="felx flex-1 felx-col justify-start">
        <h3 className="text-heading4-medium text-light-1 mb-3">Authors for you:</h3>
        <div className="flex flex-col gap-4 divide-y-2 border-b-2 pb-4 border-white">
          <UserCarousel users={JSON.parse(JSON.stringify(similarAuthors))} userId={user.id} follow="follow" />
        </div>
      </div>
      <div className="felx flex-1 felx-col justify-start">
        <h3 className="text-heading4-medium text-light-1 mb-3">Followed Authors:</h3>
        <div className="flex flex-col gap-4 divide-y-2 border-b-2 pb-4 border-white">
          <UserCarousel users={JSON.parse(JSON.stringify(followedAuthors))} userId={user.id} follow="unfollow" />
        </div>
      </div>
    </section>
  )
}

export default RightSidebar;