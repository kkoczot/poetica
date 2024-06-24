"use client";
import { ObjectId } from "mongoose";
import Image from "next/image";
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
  content: string;
  favourite: ObjectId[];
  comments: any[]; // Update this if you have a defined structure for comments
  __v: number;
}

function FavouritePoems(data: any) {
  const router = useRouter();
  const sp = useSearchParams();
  const spQ = sp.get('q')?.split('.') || "";
  const poemData = JSON.parse(data.data).map((d:any) => JSON.parse(d));
  // console.log(sp.get("page"));

  const showPerPage = 1;

  function replaceSpacesWithHyphens(type: string) {
    return type.replace(/\s+/g, '-').toLowerCase();
  }

  function handleTextShow() {
    if (poemData.filter((d: Poem) => d.folderId.shared).length < 1) {
      return <p className="text-red-500">You do not like any poems yet!</p>
    }
    else if (spQ !== "" && poemData.filter((d: Poem) => d.folderId.shared && spQ?.includes(replaceSpacesWithHyphens(d.type))).length < 1) {
      return <p className="text-red-500">You do not like any poems that are the type you have choosen!</p>
    }
  }

  function getProperPoems() {
    let page = Number(sp.get("page")) || 1;
    // console.log("page: ", page);

    const adequatePoems = poemData.filter((d: Poem) => d.folderId.shared && (spQ === "" || spQ?.includes(replaceSpacesWithHyphens(d.type))));
    // console.log("adequatePoems: ", adequatePoems);

    const countPoems = adequatePoems.length;
    // console.log("countPoems: ", countPoems);

    const pages = Math.ceil(countPoems / showPerPage);
    // console.log("pages: ", pages);


    // Popracować nad wyświetlaniem! Sprawdzić czy poprawiona wersja działa!
    if (page > pages || page < 0) page = 1;
    const poemsToShow = adequatePoems.filter((_: any, i: number) => (i + 1 >= page -1  * showPerPage + 1) && (i + 1 <= page * showPerPage));
    console.log("poemsToShow: ", poemsToShow);
    return poemsToShow;
  }

  function handleSearchParams(index: number) {
    if (spQ === "") {
      if (index === 1) return "/favourite"
      else return `/favourite?page=${index}`
    }
    else {
      if (index === 1) return `/favourite${spQ ? `?q=${spQ}` : ""}`
      else return `/favourite?${spQ ? `q=${spQ}&` : ""}page=${index}`;
    }
  }

  function handlePagination() {
    let page = Number(sp.get("page")) || 1;
    const countPoems = poemData.filter((d: Poem) => d.folderId.shared && (spQ === "" || spQ?.includes(replaceSpacesWithHyphens(d.type)))).length;
    const pages = Math.ceil(countPoems / showPerPage);
    // if (page > pages || page < 0) router.push(`/favourite${spQ ? `?q=${spQ}` : ""}`);
    if (!pages) return false;
    return Array.from({ length: pages }, (_, i) => (
      <button
        key={i + 1}
        disabled={page === i+1}
        className={`border border-white rounded-lg px-5 py-1 text-white ${page === i + 1 ? "bg-white !text-black" : ""}`}
        onClick={() => router.push(handleSearchParams(i + 1))}
      >
        {i + 1}
      </button>
    ))
  }


  return (
    <div>
      <p className="text-heading1-bold text-white mt-10">Poems</p>
      <div>
        {/* 
          - Dodać napis, że user nie ma jeszcze polubionych wierszy jesli jeszcze ich nie ma
          - Dodać napis, że user nie lubi jeszcze wierszy danego typu
          - Ogarnąć wygląd
          - Ogarnąć system stronicowania | NAJTRUDNIEJSZE ZADANIE NA TEJ STRONIE
        */}
        {handleTextShow()}
        {
          getProperPoems().map((d: Poem) => (
            <div key={d._id.toString()} className="text-white my-5">
              <div>
                <Link href={`/profile/${d.authorId.id}`} className="inline-block">
                  <Image src={d.authorId.image} alt={d.authorId.name} width={48} height={48} />
                </Link>
                <Link href={`/profile/${d.authorId.id}`}><p>@{d.authorId.username}</p></Link>
                <p className="my-2">Folder: {d.folderId.title}</p>
              </div>
              <div className="space-y-2">
                <h3>Title: {d.title}</h3>
                <h4>Type: {d.type}</h4>
                <p className="text-light-2 whitespace-break-spaces">{d.content}</p>
              </div>
            </div>
          )
          )
        }
      </div>
      <div className="flex justify-center border border-white p-5 rounded-lg my-10">
        <div className="flex space-x-5">
          {
            handlePagination() || <button disabled className="text-black bg-white border border-white py-1 px-5 rounded-lg">1</button>
          }
        </div>
      </div>
    </div>
  )
}

export default FavouritePoems;