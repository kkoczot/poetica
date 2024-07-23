"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SearchBtns() {
  const pathname = usePathname();

  function checkIfActive(type: string) {
    return pathname !== type ? "opacity-60" : "";
  }

  return (
    <div>
      <h1 className="head-text mb-8">Search</h1>
      <h2 className="text-white font-semibold text-[24px] mb-3">Find:</h2>
      <div className="flex gap-5 mb-6">
        <Link
          href="/search"
          className={`text-white px-6 py-1 border border-white rounded-lg hover:text-black hover:bg-white hover:opacity-80 ${checkIfActive("/search")}`}
        >All</Link>
        <Link
          href="/search/authors"
          className={`text-white px-6 py-1 border border-white rounded-lg hover:text-black hover:bg-white hover:opacity-80 ${checkIfActive("/search/authors")}`}
        >Authors</Link>
        <Link
          href="/search/folders"
          className={`text-white px-6 py-1 border border-white rounded-lg hover:text-black hover:bg-white hover:opacity-80 ${checkIfActive("/search/folders")}`}
        >Folders</Link>
        <Link
          href="/search/poems"
          className={`text-white px-6 py-1 border border-white rounded-lg hover:text-black hover:bg-white hover:opacity-80 ${checkIfActive("/search/poems")}`}
        >Poems</Link>
      </div>
    </div>
  )
}

export default SearchBtns;