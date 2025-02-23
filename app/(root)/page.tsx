"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import HomePoems from "@/components/interactiveElements/HomePoems";

function Home() {

  // const router = useRouter();
  // const tgs = useSearchParams().get("tag")?.trim();

  // if(tgs) router.push(`/tags/${tgs}`);
  // else
  return (
    <main>
      <div>
        <h1 className="head-text text-left mb-8">Poetica <Link href={"/"}>Home</Link></h1>
      </div>
      <div className="text-white">
        <div>
          <h2>Challenge tag for today is:</h2>
          <Link href={`/tags/${"krym"}`} >krym</Link>
          <br />
          <span>Tags is a challenge from 15.02 to 31.02</span>
          <div>
            <h3>Check out other hot tags</h3>

          </div>
        </div>
      </div>
      <div>
        {
          <HomePoems />
        }
      </div>
    </main>
  );
};

export default Home;