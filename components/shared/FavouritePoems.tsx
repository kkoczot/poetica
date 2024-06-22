"use client";
import { useSearchParams } from "next/navigation";

function FavouritePoems(data: any) {
  const sp = useSearchParams();
  
  return (
    <div>
      <p className="text-heading1-bold text-white mt-10">Poems</p>
    </div>
  )
}

export default FavouritePoems;