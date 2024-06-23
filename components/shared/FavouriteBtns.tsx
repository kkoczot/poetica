"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { poemTypes } from "@/constants";

function FavouriteBtns() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  // console.log("RE-RENDER!");
  const spQ = sp.get('q') || "";
  // console.log(spQ);

  function replaceSpacesWithHyphens(type: string) {
    return type.replace(/\s+/g, '-').toLowerCase();
  }

  function handleButton(type: string) {
    if (!spQ) {
      router.push(`${pathname}?q=${type}`);
    } else if (spQ.includes(type)) {
      if (spQ.split('.').length === 1) {
        router.push(pathname);
      } else {
        const q = spQ.split('.').filter(function (element) { return element != type }).join('.');
        router.push(`${pathname}?q=${q}`);
      }
    } else {
      router.push(`${pathname}?q=${spQ}.${type}`);
    }
  }

  function checkIfActive(type: string) {
    return spQ.includes(type);
  }

  return (
    <div>
      {
        poemTypes.map((pt, i) => (
          <button
            key={i}
            className={`text-white border border-white rounded-lg px-4 py-1 mx-2
              ${checkIfActive(replaceSpacesWithHyphens(pt.poemType)) ? "bg-white !text-black" : ""}
              `}
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