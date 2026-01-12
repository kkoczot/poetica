"use client";

import { ObjectId } from "mongoose";
import { useAuth } from "@clerk/nextjs";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Author {
  _id: ObjectId;
  id: string;
  image: string;
  name: string;
  username: string;
}

interface Folder {
  _id: ObjectId;
  title: string;
  shared: boolean;
}

interface Poem {
  _id: ObjectId;
  authorId: Author;
  folderId: Folder;
  title: string;
  type: string;
  tags: string[];
  content: string;
  favourite: ObjectId[];
  comments: any[]; // Update this if you have a defined structure for comments
  __v: number;
}

// TODO:
// Napisać funkcję, która wyświetli odpowiednią ilość wierszy aby pojawił się scroll
// Pseudokod: (wykorzystać: [zapewne] useEffect )
// - wykonywać dopóki: po pobraniu i wyświetleniu danych wysokość strony jest mniejsza od wysokości ekranu
// - zmienić toDisplay, showData, poems aby wywołać re-render

function TagsLayout({ children }: { children: React.ReactNode }) {

  // const router = useRouter();
  // const tgs = useSearchParams().get("tag")?.trim();

  // if(tgs) router.push(`/tag/${tgs}`);
  // else
  return (
    <main>
      <div>
        <h1 className="head-text text-left mb-8">Poetica <Link href={"/tags/"}>TagsLayout</Link></h1>
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
        <Suspense fallback={<p className="text-white text-3xl text-[24px] tracking-wider animate-pulse">Loading...</p>}>
          {children}
        </Suspense>
      </div>
    </main>
  );
};

export default TagsLayout;