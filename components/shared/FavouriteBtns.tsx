"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { poemTypes } from "@/constants";

function FavouriteBtns() {
  const router = useRouter();
  const sp = useSearchParams();
  const spQ = sp.get('q') || "";
  const page = Number(sp.get("page")) || 1;

  function replaceSpacesWithHyphens(type: string) {
    return type.replace(/\s+/g, '-').toLowerCase();
  }

  function handleButton(type: string) {
    if (!spQ) {
      if (page === 1) router.push(`/favourite?q=${type}`)
      else router.push(`/favourite?q=${type}&page=${page}`)
    } else if (spQ.includes(type)) {
      if (spQ.split('.').length === 1) {
        if (page === 1) router.push("/favourite")
        else router.push(`/favourite?page=${page}`);
      } else {
        const q = spQ.split('.').filter(function (element) { return element != type }).join('.');
        if (page === 1) router.push(`/favourite?q=${q}`);
        else router.push(`/favourite?q=${q}&page=${page}`);
      }
    } else {
      if (page === 1) router.push(`/favourite?q=${spQ}.${type}`);
      else router.push(`/favourite?q=${spQ}.${type}&page=${page}`);
    }
  }

  function checkIfActive(type: string) {
    return spQ.includes(type);
  }

  return (
    <div className="grid max-sm:grid-cols-2 grid-cols-4 gap-4">
      {
        poemTypes.map((pt, i) => (
          <button
            key={i}
            className={`text-white border rounded-lg px-5 py-2 hover:opacity-80`}
            style={checkIfActive(replaceSpacesWithHyphens(pt.poemType)) ? { color: "white", backgroundColor: pt.color } : undefined}
            onClick={() => handleButton(replaceSpacesWithHyphens(pt.poemType))}
          >
            {pt.poemType}
          </button>
        ))
      }
    </div>
  )
}

export default FavouriteBtns;