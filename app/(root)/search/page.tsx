"use client";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { searchSimple as searchSimpleAuthors } from "@/lib/actions/user.actions";
import { searchSimple as searchSimpleFolders } from "@/lib/actions/folder.actions";
import { searchSimple as searchSimplePoems } from "@/lib/actions/poem.actions";
import SearchCard from "@/components/shared/SearchCard";

// Odpowiada za szukanie po: nazwie usera, nazwie wiersza, tagach || ogarnąć system stronicowania dla wyszukiwań
// (Najpierw zrobić wyszukiwania / potem stronicowanie - patrzeć /favourite)

const Page = () => {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any[]>([]);

  async function getData() {
    const foundAuthors = await searchSimpleAuthors(search);
    console.log(" --- foundAuthors: ", foundAuthors);
    const foundFolders = await searchSimpleFolders(search);
    console.log(" --- foundFolders: ", foundFolders);
    const foundPoems = await searchSimplePoems(search);
    console.log(" --- foundPoems: ", foundPoems);
    return [foundAuthors, foundFolders, foundPoems];
  }

  async function handleSearch() {
    const data = await getData();
    !show && setShow(prev => !prev);
    setData(data);
  }

  function countData() {
    const authors = data[0]?.length;
    const folders = data[1]?.length;
    const poems = data[2]?.length;
    return authors + folders + poems > 0
  }

  function handleShow() {
    const all: any[] = [];
    all.push(<h3 className="text-white text-[20px] mt-10 mb-2">Authors:</h3>);
    if (data[0].length) {
      data[0].map((author: any) => all.push(
        <SearchCard key={String(author.id)} type="author" textInfo={`@${author.username}`} url={`/profile/${author.id}`} linkInfo="profile" img={author.image} />
      ));
    } else {
      all.push(<p className="text-red-500">Authors not found</p>);
    }
    all.push(<h3 className="text-white text-[20px] mt-10 mb-2">Folders:</h3>);
    if (data[1].length) {
      data[1].map((folder: any) => all.push(
        <SearchCard key={String(folder._id)} type="folder" textInfo={folder.title} url={`/profile/${folder.authorId.id}/${folder._id}`} linkInfo="folder" />
      ));
    } else {
      all.push(<p className="text-red-500">Folders not found</p>);
    }
    all.push(<h3 className="text-white text-[20px] mt-10 mb-2">Poems:</h3>);
    if (data[2].length) {
      data[2].map((poem: any) => all.push(
        <SearchCard key={String(poem._id)} type="poem" textInfo={poem.title} url={`/profile/${poem.authorId.id}/${poem.folderId}/${poem._id}`} linkInfo="poem" />
      ))
    } else {
      all.push(<p className="text-red-500">Poems not found</p>);
    }
    return all;
  }

  return (
    <section>
      <h3 className="text-white text-[20px] my-4">SearchFilters for All/Default:</h3>
      <div className="flex flex-col border-l-4 border-green-600 pt-2 pb-3 pl-4">
        <label htmlFor="text" className="text-white block mb-1">Search everything</label>
        <div className="flex gap-4">
          <Input
            id="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="username/folder_title/poem_title"
            maxLength={50}
          />
          <Image
            src="/assets/search-gray.svg"
            alt="search"
            width={24}
            height={24}
            className="object-contain hover:cursor-pointer"
            onClick={handleSearch}
          />
        </div>
        <p className="text-gray-400 text-subtle-medium mt-1">*displays up to 5 results for every category</p>
      </div>
      <div className="my-10">
        {
          show ? countData() ? handleShow() : <p className="text-red-500">No results found!</p> : null
        }
      </div>
    </section>
  )
}

export default Page;