"use client";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { searchComplex } from "@/lib/actions/poem.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { poemTypes } from "@/constants";

// Odpowiada za szukanie po: nazwie usera, nazwie wiersza, tagach || ogarnąć system stronicowania dla wyszukiwań
// (Najpierw zrobić wyszukiwania / potem stronicowanie - patrzeć /favourite)

const Page = () => {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any[]>([]);

  async function getData() {
    const poems = await searchComplex() || [];
    return poems;
  }

  async function handleSearch() {
    const data = await getData();
    !show && setShow(prev => !prev);
    setData(data);
  }

  function countData() {
    const poems = data?.length;
    return poems > 0
  }

  function handleShow() {
    const poems: any[] = [];
    if (data.length) {
      data.map((poem: any) => poems.push(
        <div className="my-2" key={poem.username}>
          <p className="text-white">{poem.username}</p>
        </div>
      ));
    }
    return poems.map(item => item);
  }

  return (
    <section>
      <h3 className="text-white text-[20px] my-4">Results of SearchFilters Poems:</h3>
      <div className="flex gap-4 flex-row-reverse">
        <Image
          src="/assets/search-gray.svg"
          alt="search"
          width={24}
          height={24}
          className="object-contain hover:cursor-pointer"
          onClick={handleSearch}
        />
        <Select> {/* onValueChange={field.onChange} defaultValue={field.value} */}
          <SelectTrigger>
            <SelectValue placeholder="Select poem type" />
          </SelectTrigger>
          <SelectContent className="bg-dark-4">
            <SelectItem value="any" className="no-focus border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">Any</SelectItem>
            {
              poemTypes.map((pType: any) => (
                <SelectItem value={pType.poemType} key={pType.poemType} className="no-focus border border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">{pType.poemType}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
        <Input
          id="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search poem title/content"
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