"use client";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { searchComplex } from "@/lib/actions/user.actions";

// Odpowiada za szukanie po: nazwie usera, nazwie wiersza, tagach || ogarnąć system stronicowania dla wyszukiwań
// (Najpierw zrobić wyszukiwania / potem stronicowanie - patrzeć /favourite)

const Page = () => {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any[]>([]);

  async function getData() {
    const authors = await searchComplex() || [];
    return authors;
  }

  async function handleSearch() {
    const data = await getData();
    !show && setShow(prev => !prev);
    setData(data);
  }

  function countData() {
    const authors = data?.length;
    return authors > 0
  }

  function handleShow() {
    const authors: any[] = [];
    if (data.length) {
      data.map((author: any) => authors.push(
        <div className="my-2" key={author.username}>
          <p className="text-white">{author.username}</p>
        </div>
      ));
    }
    return authors.map(item => item);
  }

  return (
    <section>
      <h3 className="text-white text-[20px] my-4">Results of SearchFilters Authors:</h3>
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
          placeholder="Search username"
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