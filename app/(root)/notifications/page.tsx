import { handleNotifs } from "@/lib/actions/notifs.actions";
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
  const [notifs, amount] = await handleNotifs(user.id);

  return (
    <section>
      <h1 className="head-text mb-10">Notifications</h1>
      {
        notifs.map((notif, i) => (
          <>
            <div key={i} className="text-white border-l-4 pt-2 pb-3 pl-3 my-5 border-green-600">
              <h3 className="text-body-bold">{notif.title}</h3>
              <h4 className="text-[12px] text-gray-200">{notif.createdAt}</h4>
              <p className="mt-2">{notif.content}</p>
            </div>
            {
              (i + 1 <= amount && amount < i + 2) && (
                <div className="mb-4">
                  <p className="text-white w-full text-center tracking-wider">New notifs</p>
                  <div className="w-full h-1 rounded-md bg-green-600" />
                </div>)
            }
          </>
        ))
      }
    </section>
  )
}

export default Page;