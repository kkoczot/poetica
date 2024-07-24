// Tutaj napisać podziękowania
// const Page = async () => {
//   return (
//     <section>
//       <h1 className="head-text mb-10">Credits - podziękowania</h1>
//     </section>
//   )
// }

// export default Page;

"use client";
import { checkIfNewUser } from "@/lib/actions/user.actions";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const Page = () => {
  const { userId } = useAuth();

  return (
    <section>
      <h1 className="head-text mb-10">Check if func works</h1>
      <button className="px-6 py-2 bg-green-500 text-white rounded-2xl" onClick={() => checkIfNewUser(String(userId))}>Check</button>
    </section>
  )
}

export default Page;