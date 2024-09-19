"use client";
import { poemTypes } from "@/constants";
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
  comments: any[];
  __v: number;
}

function FavouritePoems(data: any) {
  const router = useRouter();
  const sp = useSearchParams();
  const spQ = sp.get('q')?.split('.') || "";
  const poemData = JSON.parse(data.data).map((d: any) => JSON.parse(d));

  const showPerPage = 5;

  function replaceSpacesWithHyphens(type: string) {
    return type.replace(/\s+/g, '-').toLowerCase();
  }

  function handleTextShow(action: "text" | "amount") {
    if (action === "text") {
      if (poemData.filter((d: Poem) => d.folderId.shared).length < 1) {
        return <p className="text-red-500 mt-5">You do not like any poems yet!</p>
      }
      else if (spQ !== "" && poemData.filter((d: Poem) => d.folderId.shared && spQ?.includes(replaceSpacesWithHyphens(d.type))).length < 1) {
        return <p className="text-red-500 mt-5">You do not like any poems that are the type you have choosen!</p>
      }
    } else if (action === "amount") {
      if (spQ !== "") return <p className="text-white inline-block ml-2">(found {poemData.filter((d: Poem) => d.folderId.shared && spQ?.includes(replaceSpacesWithHyphens(d.type))).length} poems)</p>
    }
  }

  function getProperPoems() {
    let page = Number(sp.get("page")) || 1;

    const adequatePoems = poemData.filter((d: Poem) => d.folderId.shared && (spQ === "" || spQ?.includes(replaceSpacesWithHyphens(d.type))));

    const countPoems = adequatePoems.length;

    const pages = Math.ceil(countPoems / showPerPage);

    if (page > pages || page < 0) page = 1;
    const poemsToShow = adequatePoems.filter((_: any, i: number) => (i + 1 >= page - 1 * showPerPage + 1) && (i + 1 <= page * showPerPage));
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
    if (!pages || page > pages) return false;
    if (pages < 11) {
      return Array.from({ length: pages }, (_, i) => (
        <button
          key={i + 1}
          title={String(i + 1)}
          disabled={page === i + 1}
          className={`border border-white rounded-lg px-[12px] py-1 text-white ${page === i + 1 ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
          onClick={() => router.push(handleSearchParams(i + 1))}
        >
          {i + 1}
        </button>
      ))
    } else {
      if (page < 5) {
        const btnsToDisplay = Array.from({ length: page + (6 - page) }, (_, i) => (
          <button
            key={i + 1}
            title={String(i + 1)}
            disabled={page === i + 1}
            className={`border border-white rounded-lg px-[12px] py-1 text-white ${page === i + 1 ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
            onClick={() => router.push(handleSearchParams(i + 1))}
          >
            {i + 1}
          </button>
        ))
        btnsToDisplay.push(
          <button
            key={pages}
            title={String(pages)}
            className={`border border-white rounded-lg px-[12px] py-1 text-white hover:opacity-80 hover:cursor-pointer`}
            onClick={() => router.push(handleSearchParams(pages))}
          >
            {pages}
          </button>
        );
        return btnsToDisplay;
      }
      else if (pages - page > 3) {
        const iList = [-2, -1, 0, 1, 2];
        const btnsToDisplay = Array.from({ length: iList.length }, (_, i) => (
          <button
            key={page + iList[i]}
            title={String(page + iList[i])}
            disabled={page === page + iList[i]}
            className={`border border-white rounded-lg px-[12px] py-1 text-white ${page === page + iList[i] ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
            onClick={() => router.push(handleSearchParams(page + iList[i]))}
          >
            {page + iList[i]}
          </button>
        ));
        btnsToDisplay.unshift(
          <button
            key={1}
            title="1"
            className={`border border-white rounded-lg px-[12px] py-1 text-white hover:opacity-80 hover:cursor-pointer`}
            onClick={() => router.push(handleSearchParams(1))}
          >
            {1}
          </button>
        );
        btnsToDisplay.push(
          <button
            key={pages}
            title={String(pages)}
            className={`border border-white rounded-lg px-[12px] py-1 text-white hover:opacity-80 hover:cursor-pointer`}
            onClick={() => router.push(handleSearchParams(pages))}
          >
            {pages}
          </button>
        );
        return btnsToDisplay;
      } else {
        const iList = pages - page > 2 ? [-2, -1, 0] : pages - page > 1 ? [-3, -2, -1, 0] : pages - page > 0 ? [-4, -3, -2, -1, 0] : [-5, -4, -3, -2, -1, 0];
        const btnsToDisplay = Array.from({ length: iList.length + pages - page }, (_, i) => (
          <button
            key={page + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i])}
            title={String(page + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i]))}
            disabled={page === page + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i])}
            className={`border border-white rounded-lg px-[12px] py-1 text-white ${page === page + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i]) ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
            onClick={() => router.push(handleSearchParams(page + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i])))}
          >
            {page + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i])}
          </button>
        ));
        btnsToDisplay.unshift(
          <button
            key={1}
            title="1"
            className={`border border-white rounded-lg px-[12px] py-1 text-white hover:opacity-80 hover:cursor-pointer`}
            onClick={() => router.push(handleSearchParams(1))}
          >
            {1}
          </button>
        );
        return btnsToDisplay;
      }
    }
  }


  return (
    <div>
      <div>
        <p className="text-heading1-bold text-white mt-10 inline-block">Poems</p>
        {handleTextShow("amount")}
      </div>
      <div className='mt-4 h-0.5 w-full bg-dark-3' />
      <div>
        {handleTextShow("text")}
        {
          getProperPoems().map((d: Poem) => {
            const poemType = poemTypes.filter(type => type.poemType.toLowerCase() === d.type.toLowerCase())[0];
            return (
              <div key={d._id.toString()} className="my-14 p-4 pb-6 rounded-lg bg-dark-3 text-white">
                <div className="flex flex-col items-start relative">
                  <div title={'@' + d.authorId.username} className="absolute top-2 right-2 h-11 w-11 rounded-full border-2 border-green-700 flex items-center overflow-hidden">
                    <Link href={`/profile/${d.authorId.id}`} >
                      <Image src={d.authorId.image} alt={'@'+d.authorId.username} width={64} height={64} className="opacity-50" />
                    </Link>
                  </div>
                  <Link href={`/profile/${d.authorId.id}/${d.folderId._id}/${d._id}`}><h3 className="text-[22px] font-semibold">{d.title}</h3></Link>
                  <div className="mb-4 italic opacity-80 flex flex-col cursor-default items-start">
                    <div className="flex">
                      <div className="h-3 w-3 rounded-full self-center mr-1" style={{ backgroundColor: poemType.color }} />
                      <h4 className="self-start" title="Poem type">{d.type}</h4>
                    </div>
                    <Link href={`/profile/${d.authorId.id}`}>
                      <h4 title="Author">@{d.authorId.username}</h4>
                    </Link>
                    <Link href={`/profile/${d.authorId.id}/${d.folderId._id}`}><h4 className="self-start" title="Folder">{d.folderId.title}</h4></Link>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3>Title: {d.title}</h3>
                  <h4>Type: {d.type}</h4>
                  <p className="text-light-2 whitespace-break-spaces">{d.content}</p>
                </div>
              </div>
            )
          }
          )
        }
      </div>
      <div className="flex justify-center border border-white p-5 rounded-lg mt-[60px]">
        <div className="flex space-x-4">
          {
            handlePagination() || <button disabled className="text-black bg-white border border-white px-[12px] py-1 rounded-lg">1</button>
          }
        </div>
      </div>
    </div>
  )
}

export default FavouritePoems;