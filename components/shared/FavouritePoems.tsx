"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function FavouritePoems(data: any) {
  const sp = useSearchParams();
  const poemData = JSON.parse(data.data).map(d => JSON.parse(d));

  function replaceSpacesWithHyphens(type: string) {
    return type.replace(/\s+/g, '-').toLowerCase();
  }

  const spQ = sp.get('q')?.split('.') || "";

  return (
    <div>
      <p className="text-heading1-bold text-white mt-10">Poems</p>
      <div>
        {/* 
          - Dodać napis, że user nie ma jeszcze polubionych wierszy jesli jeszcze ich nie ma
          - Dodać napis, że user nie lubi jeszcze wierszy danego typu
          - Ogarnąć wygląd
          - Ogarnąć system stronicowania | NAJTRUDNIEJSZE ZADANIE NA TEJ STRONIE
        */}
        {
          poemData.map(d => {
            if (d.folderId.shared && (spQ === "" || spQ?.includes(replaceSpacesWithHyphens(d.type)))) return (
              <div className="text-white my-5">
                <div>
                  <Link href={`/profile/${d.authorId.id}`} className="inline-block">
                    <Image src={d.authorId.image} alt={d.authorId.name} width={48} height={48} />
                  </Link>
                  <Link href={`/profile/${d.authorId.id}`}><p>@{d.authorId.username}</p></Link>
                  <p>Folder: {d.folderId.title}</p>
                </div>
                <div>
                  <h3>Title: {d.title}</h3>
                  <h4>Type: {d.type}</h4>
                  <p>{d.content}</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default FavouritePoems;