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
  const [howManyResults, setHowManyResults] = useState<number>(0)

  async function getData() {
    const results = await searchComplex({ ...search, page: pageNum, dpp: dpp }) || [];
    setHowManyResults(results.length ? results[1] : 0);
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
    poems.push(<h3 className="text-white text-[20px] mt-6 mb-2">Poems:</h3>);
    if (data.length) {
      data.map((poem: any) => poems.push(
        <SearchCard key={String(poem._id)} type="poem" textInfo={poem.title} url={`/profile/${poem.authorDetails.id}/${poem.folderId}/${poem._id}`} linkInfo="poem" />
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
      <h3 className="text-white text-[20px] my-4">Results of SearchFilters Poems:</h3>
      <div className="flex gap-4 flex-row-reverse">
        <Image
          src="/assets/search-gray.svg"
          alt="search"
          width={24}
          height={24}
          className="object-contain hover:cursor-pointer"
          onClick={() => handleSearch(true)}
        />
        <Select defaultValue="any" onValueChange={e => setSearch(prev => ({ ...prev, sortOrder: e }))}> {/* onValueChange={field.onChange} defaultValue={field.value} */}
          <SelectTrigger>
            <SelectValue placeholder="Select/Filter by poems amount" />
          </SelectTrigger>
          <SelectContent className="bg-dark-4">
            <SelectItem value="max" className="no-focus border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">Max</SelectItem>
            <SelectItem value="any" className="no-focus border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">Any</SelectItem>
            <SelectItem value="min" className="no-focus border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">Min</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="any" onValueChange={e => setSearch(prev => ({ ...prev, poemType: e }))}> {/* onValueChange={field.onChange} defaultValue={field.value} */}
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
          value={search.text}
          onChange={e => setSearch(prev => ({ ...prev, text: e.target.value }))}
          placeholder="Search poem title/content"
        />
      </div>
      <div className="my-10">
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