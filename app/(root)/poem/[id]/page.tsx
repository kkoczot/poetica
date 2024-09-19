import { redirect } from "next/navigation";

const Page = async () => {
  redirect("/");
  return (
    <section>
      <h1 className="head-text mb-10">Poem</h1>
    </section>
  )
}

export default Page;