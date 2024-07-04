"use client";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { searchComplex } from "@/lib/actions/folder.actions";

// Odpowiada za szukanie po: nazwie usera, nazwie wiersza, tagach || ogarnąć system stronicowania dla wyszukiwań
// (Najpierw zrobić wyszukiwania / potem stronicowanie - patrzeć /favourite)

const Page = () => {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any[]>([]);

  async function getData() {
    const folders = await searchComplex() || [];
    return folders;
  }

  async function handleSearch() {
    const data = await getData();
    !show && setShow(prev => !prev);
    setData(data);
  }

  function countData() {
    const folders = data?.length;
    return folders > 0
  }

  function handleShow() {
    const folders: any[] = [];
    if (data.length) {
      data.map((folder: any) => folders.push(
        <div className="my-2" key={folder.username}>
          <p className="text-white">{folder.username}</p>
        </div>
      ));
    }
    return folders.map(item => item);
  }

  return (
    <section>
      <h3 className="text-white text-[20px] my-4">Results of SearchFilters Folders:</h3>
      <div className="flex gap-4 flex-row-reverse">
        <Image
          src="/assets/search-gray.svg"
          alt="search"
          width={24}
          height={24}
          className="object-contain hover:cursor-pointer"
          onClick={handleSearch}
        />
        <Input
          id="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search folder title"
        />
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