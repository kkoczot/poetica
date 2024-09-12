"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { searchComplex } from "@/lib/actions/poem.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { poemTypes } from "@/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchCard from "@/components/shared/SearchCard";
import handlePagination from "@/components/PaginationFunctions";

// Odpowiada za szukanie po: nazwie usera, nazwie wiersza, tagach || ogarnąć system stronicowania dla wyszukiwań
// (Najpierw zrobić wyszukiwania / potem stronicowanie - patrzeć /favourite)

const Page = () => {
  const dpp = 20;
  const router = useRouter();
  const pathname = usePathname();
  const pageNum = Number(useSearchParams().get("page")) || 1;
  const [search, setSearch] = useState({ text: "", poemType: "any", sortOrder: "any" });
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [howManyResults, setHowManyResults] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);
    const results = await searchComplex({ ...search, page: pageNum, dpp: dpp }) || [];
    setHowManyResults(results.length ? results[1] : 0);
    setLoading(false);
    return results[0];
  }

  async function handleSearch(refatch: Boolean) {
    const data = await getData();
    !show && setShow(prev => !prev);
    setData(data);
    console.log(data);
    refatch && router.push(pathname);
  }

  useEffect(() => {
    if (show) {
      handleSearch(false);
    }
  }, [pageNum]);

  function handleShow() {
    const poems: any[] = [];
    poems.push(<h3 key="handleshow-title-poems" className="text-white text-[20px] mt-6 mb-2">Poems:</h3>);
    if (data.length) {
      data.map((poem: any) => poems.push(
        <SearchCard key={String(poem._id)} type="poem" textInfo={poem.title} url={`/profile/${poem.authorDetails.id}/${poem.folderId}/${poem._id}`} linkInfo="poem" poemType={poem.type} />
      ));
    } else {
      poems.push(<p className="text-red-500">Poems not found</p>);
    }
    return poems.map(item => item);
  }

  function handleRouter(func: string) {
    router.push(func);
  }

  return (
    <section>
      <h3 className="text-white text-[20px] my-4">SearchFilters for Poems:</h3>
      <div className="flex flex-col gap-8">
        <div className="border-l-4 border-green-600 pt-2 pb-5 pl-4">
          <label htmlFor="text" className="text-white block mb-1">Search title</label>
          <Input
            id="text"
            value={search.text}
            onChange={e => setSearch(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Search poem title"
            maxLength={50}
          />
        </div>
        <div className="border-l-4 border-green-600 pt-2 pb-5 pl-4">
          <label htmlFor="type" className="text-white block mb-1">Select a type of poem</label>
          <Select defaultValue="any" onValueChange={e => setSearch(prev => ({ ...prev, poemType: e }))}> {/* onValueChange={field.onChange} defaultValue={field.value} */}
            <SelectTrigger id="type">
              <SelectValue placeholder="Select poem type" />
            </SelectTrigger>
            <SelectContent className="bg-dark-4">
              <SelectItem value="any" className="no-focus border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">Any</SelectItem>
              {
                poemTypes.map((pType: any) => (
                  <SelectItem
                    key={pType.poemType}
                    value={pType.poemType}
                    className="no-focus border border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer"
                  >
                    <span className="flex gap-2">
                      <div className="h-3 w-3 rounded-full self-center mr-1" style={{ backgroundColor: pType.color }} />
                      {pType.poemType}
                    </span>
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        <div className="border-l-4 border-green-600 pt-2 pb-5 pl-4">
          <label htmlFor="sort" className="text-white block mb-1">Sort by amout of hearts</label>
          <div className="flex gap-4">
            <Select defaultValue="any" onValueChange={e => setSearch(prev => ({ ...prev, sortOrder: e }))}> {/* onValueChange={field.onChange} defaultValue={field.value} */}
              <SelectTrigger id="sort">
                <SelectValue placeholder="Select/Filter by poems amount" />
              </SelectTrigger>
              <SelectContent className="bg-dark-4">
                <SelectItem value="max" className="no-focus border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">Max</SelectItem>
                <SelectItem value="any" className="no-focus border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">Any</SelectItem>
                <SelectItem value="min" className="no-focus border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">Min</SelectItem>
              </SelectContent>
            </Select>
            <Image
              src="/assets/search-gray.svg"
              alt="search"
              width={24}
              height={24}
              className="object-contain hover:cursor-pointer"
              onClick={() => handleSearch(true)}
            />
          </div>
        </div>
      </div>
      <div className="my-10">
        {
          loading && <p className="text-white text-3xl text-[24px] tracking-wider animate-pulse">Loading data...</p>
        }
        {
          show ? handleShow() : null
        }
      </div>
      <div className="flex justify-center border border-white p-5 rounded-lg mt-[60px]">
        <div className="flex space-x-4">
          {
            handlePagination(pathname, howManyResults, dpp, pageNum, handleRouter)
          }
        </div>
      </div>
    </section>
  )
}

export default Page;