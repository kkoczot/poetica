import { redirect } from "next/navigation";

// Patrzenie konkretnego wiersza i dodawanie komentarzy
const Page = async () => {
  redirect("/");
  return (
    <section>
      <h1 className="head-text mb-10">Poem</h1>
    </section>
  )
}

export default Page;