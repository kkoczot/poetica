"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { searchComplex } from "@/lib/actions/user.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SearchCard from "@/components/shared/SearchCard";
import handlePagination from "@/components/PaginationFunctions";

const Page = () => {
  const dpp = 20;
  const router = useRouter();
  const pathname = usePathname();
  const pageNum = Number(useSearchParams().get("page")) || 1;
  const [search, setSearch] = useState({ text: "", sortOrder: "any" });
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
    refatch && router.push(pathname);
  }

  useEffect(() => {
    if (show) {
      handleSearch(false)
    }
  }, [pageNum]);

  function handleShow() {
    const authors: any[] = [];
    authors.push(<h3 key="handleshow-title-authors" className="text-white text-[20px] mt-6 mb-2">Authors:</h3>);
    if (data.length) {
      data.map((author: any) => authors.push(
        <SearchCard key={String(author.id)} type="author" textInfo={`@${author.username}`} url={`/profile/${author.id}`} linkInfo="profile" img={author.image} />
      ));
    } else {
      authors.push(<p className="text-red-500">Authors not found</p>);
    }
    return authors;
  }

  function handleRouter(func: string) {
    router.push(func);
  }

  return (
    <section>
      <h3 className="text-white text-[20px] my-4">SearchFilters for Authors:</h3>
      <div className="flex flex-col gap-8">
        <div className="border-l-4 border-green-600 pt-2 pb-5  pl-4">
          <label htmlFor="text" className="text-white block mb-1">Search username</label>
          <Input
            id="text"
            value={search.text}
            onChange={e => setSearch(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Search username"
            maxLength={50}
          />
        </div>
        <div className="border-l-4 border-green-600 pt-2 pb-5  pl-4">
          <label htmlFor="sort" className="text-white block mb-1">Sort by amount of followers</label>
          <div className="flex gap-4">
            <Select defaultValue="any" onValueChange={e => setSearch(prev => ({ ...prev, sortOrder: e }))}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Select/Filter by followers amount" />
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