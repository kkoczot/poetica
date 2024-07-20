"use client";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { searchComplex } from "@/lib/actions/user.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

// Odpowiada za szukanie po: nazwie usera, nazwie wiersza, tagach || ogarnąć system stronicowania dla wyszukiwań
// (Najpierw zrobić wyszukiwania / potem stronicowanie - patrzeć /favourite)

const Page = () => {
  const router = useRouter();
  let pageNum = Number(useSearchParams().get("page")) || 1;
  const [search, setSearch] = useState({ text: "", sortOrder: "any" });
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any[[]]>([]);
  const [howMany, setHowMany] = useState<number>(0);

  async function getData() {
    const results = await searchComplex({ ...search, page: pageNum, dpp: 1 }) || [];
    setHowMany(results.length ? results[1] : 0);
    return results[0];
  }

  async function handleSearch() {
    const data = await getData();
    !show && setShow(prev => !prev);
    setData(data);
    console.log(">>> data: ", data);
    console.log(">>> howMany: ", howMany);
  }

  function countData() {
    const authors = data?.length;
    return authors > 0
  }

  function handleShow() {
    const authors: any[] = [];
    authors.push(<h3 className="text-white text-[20px] mt-6 mb-2">Authors:</h3>);
    if (data.length) {
      data.map((author: any) => authors.push(
        <div className="my-2" key={author.id}>
          <p className="text-white">{author.username}</p>
        </div>
      ));
    } else {
      authors.push(<p className="text-red-500">Authors not found</p>);
    }
    return authors;
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
        <Select onValueChange={e => setSearch(prev => ({ ...prev, sortOrder: e }))}> {/* onValueChange={field.onChange} defaultValue={field.value} */}
          <SelectTrigger>
            <SelectValue placeholder="Select/Filter by followers amount" />
          </SelectTrigger>
          <SelectContent className="bg-dark-4">
            <SelectItem value="max" className="no-focus border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">Max</SelectItem>
            <SelectItem value="any" className="no-focus border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">Any</SelectItem>
            <SelectItem value="min" className="no-focus border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">Min</SelectItem>
          </SelectContent>
        </Select>
        <Input
          id="text"
          value={search.text}
          onChange={e => setSearch(prev => ({ ...prev, text: e.target.value }))}
          placeholder="Search username"
        />
      </div>
      <div className="my-10">
        {
          show ? countData() ? handleShow() : <p className="text-red-500">No results found!</p> : null
        }
      </div>
      <div className="my-10">
        <p className="text-white">--- Stronicowanie ---</p>
        {
          howMany && Array.from({ length: howMany / 1 }, (_, i) => {
            return (
              <button
                key={i + 1}
                title={String(i + 1)}
                disabled={pageNum === i + 1}
                className={`border border-white rounded-lg px-[12px] py-1 text-white ${pageNum === i + 1 ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
                onClick={() => {
                  router.push(`/search/authors?page=${i + 1}`)
                  handleSearch();
                }}
              >
                {i + 1}
              </button>
            )
          })
        }
      </div>
    </section>
  )
}

export default Page;