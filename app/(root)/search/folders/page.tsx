"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { searchComplex } from "@/lib/actions/folder.actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchCard from "@/components/shared/SearchCard";
import handlePagination from "@/components/SearchFunctions";

// Odpowiada za szukanie po: nazwie usera, nazwie wiersza, tagach || ogarnąć system stronicowania dla wyszukiwań
// (Najpierw zrobić wyszukiwania / potem stronicowanie - patrzeć /favourite)

const Page = () => {
  const dpp = 20;
  const router = useRouter();
  const pathname = usePathname();
  const pageNum = Number(useSearchParams().get("page")) || 1;
  const [search, setSearch] = useState({ text: "", sortOrder: "any" });
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [howManyResults, setHowManyResults] = useState<number>(0);

  async function getData() {
    const folders = await searchComplex({ ...search, page: pageNum, dpp: dpp }) || [];
    setHowManyResults(folders.length ? folders[1] : 0);
    return folders[0];
  }

  async function handleSearch(refatch: Boolean) {
    const data = await getData();
    !show && setShow(prev => !prev);
    setData(data);
    refatch && router.push(pathname);
  };

  useEffect(() => {
    if (show) {
      handleSearch(false);
    }
  }, [pageNum]);

  function handleShow() {
    const folders: any[] = [];
    folders.push(<h3 className="text-white text-[20px] mt-6 mb-2">Folders:</h3>);
    if (data.length) {
      data.map((folder: any) => folders.push(
        <SearchCard key={String(folder._id)} type="folder" textInfo={folder.title} url={"uzupełnić!"} linkInfo="folder" />
      ));
    } else {
      folders.push(<p className="text-red-500">Folders not found</p>);
    }
    return folders;
  }

  function handleRouter(func: string) {
    router.push(func);
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
        <Input
          id="text"
          value={search.text}
          onChange={e => setSearch(prev => ({ ...prev, text: e.target.value }))}
          placeholder="Search folder title"
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