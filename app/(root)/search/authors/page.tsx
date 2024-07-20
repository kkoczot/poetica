"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { searchComplex } from "@/lib/actions/user.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Odpowiada za szukanie po: nazwie usera, nazwie wiersza, tagach || ogarnąć system stronicowania dla wyszukiwań
// (Najpierw zrobić wyszukiwania / potem stronicowanie - patrzeć /favourite)

const Page = () => {
  const dpp = 1;
  const router = useRouter();
  const pathname = usePathname();
  const pageNum = Number(useSearchParams().get("page")) || 1;
  const [search, setSearch] = useState({ text: "", sortOrder: "any" });
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [howManyResults, setHowManyResults] = useState<number>(0);

  async function getData() {
    const authors = await searchComplex({ ...search, page: pageNum, dpp: dpp }) || [];
    setHowManyResults(authors.length ? authors[1] : 0);
    return authors[0];
  }

  async function handleSearch() {
    const data = await getData();
    !show && setShow(prev => !prev);
    setData(data);
  }

  useEffect(() => {
    if (show) {
      handleSearch()
    }
  }, [pageNum]);

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

  function handleSearchParams(index: number) {
    if (index === 1) return pathname;
    else return `${pathname}?page=${index}`
  }

  function handlePagination() {
    const pages = Math.ceil(howManyResults / dpp);
    if (!pages || pageNum > pages) return false;
    if (pages < 11) {
      return Array.from({ length: pages }, (_, i) => (
        <button
          key={i + 1}
          title={String(i + 1)}
          disabled={pageNum === i + 1}
          className={`border border-white rounded-lg px-[12px] py-1 text-white ${pageNum === i + 1 ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
          onClick={() => router.push(handleSearchParams(i + 1))}
        >
          {i + 1}
        </button>
      ))
    } else {
      if (pageNum < 5) {
        const btnsToDisplay = Array.from({ length: pageNum + (6 - pageNum) }, (_, i) => (
          <button
            key={i + 1}
            title={String(i + 1)}
            disabled={pageNum === i + 1}
            className={`border border-white rounded-lg px-[12px] py-1 text-white ${pageNum === i + 1 ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
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
      else if (pages - pageNum > 3) {
        const iList = [-2, -1, 0, 1, 2];
        const btnsToDisplay = Array.from({ length: iList.length }, (_, i) => (
          <button
            key={pageNum + iList[i]}
            title={String(pageNum + iList[i])}
            disabled={pageNum === pageNum + iList[i]}
            className={`border border-white rounded-lg px-[12px] py-1 text-white ${pageNum === pageNum + iList[i] ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
            onClick={() => router.push(handleSearchParams(pageNum + iList[i]))}
          >
            {pageNum + iList[i]}
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
        const iList = pages - pageNum > 2 ? [-2, -1, 0] : pages - pageNum > 1 ? [-3, -2, -1, 0] : pages - pageNum > 0 ? [-4, -3, -2, -1, 0] : [-5, -4, -3, -2, -1, 0];
        const btnsToDisplay = Array.from({ length: iList.length + pages - pageNum }, (_, i) => (
          <button
            key={pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i])}
            title={String(pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i]))}
            disabled={pageNum === pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i])}
            className={`border border-white rounded-lg px-[12px] py-1 text-white ${pageNum === pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i]) ? "bg-white !text-black" : ""} hover:opacity-80 hover:cursor-pointer`}
            onClick={() => router.push(handleSearchParams(pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i])))}
          >
            {pageNum + (i > (iList.length - 1) ? i - (iList.length - 1) : iList[i])}
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
        <Select defaultValue="any" onValueChange={e => setSearch(prev => ({ ...prev, sortOrder: e }))}> {/* onValueChange={field.onChange} defaultValue={field.value} */}
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
          show ? handleShow() : null
        }
      </div>
      <div className="my-10">
        <p className="text-white">--- Stronicowanie ---</p>
      </div>
      <div className="flex justify-center border border-white p-5 rounded-lg mt-[60px]">
        <div className="flex space-x-4">
          {
            handlePagination() || <button disabled className="text-black bg-white border border-white px-[12px] py-1 rounded-lg">1</button>
          }
        </div>
      </div>
    </section>
  )
}

export default Page;