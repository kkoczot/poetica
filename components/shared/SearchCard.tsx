import { poemTypes } from "@/constants";
import Image from "next/image";
import Link from "next/link"

interface Params {
  type: "author" | "folder" | "poem";
  textInfo: string;
  img?: string;
  poemType?: string;
  url: string;
  linkInfo: string;
}

const SearchCard = ({ type, textInfo, img, poemType, url, linkInfo }: Params) => {
  let poem = null;
  if (type === "poem") {
    poem = poemTypes.filter(type => type.poemType.toLowerCase() === poemType?.toLowerCase())[0];
  }
  return (
    <div className="flex justify-between py-5 pr-10 pl-8 my-4 bg-dark-3 rounded-lg items-center">
      <div className="flex gap-2 items-center">
        {
          type === "author" && <Image src={img!} alt="Author's avatar" width={28} height={28} className="border-2 border-green-600 rounded-full aspect-square" />
        }
        {
          type === "folder" && <div className="h-3 w-3 rounded-full bg-green-500 self-center mr-1" />
        }
        {
          type === "poem" && <div className="h-3 w-3 rounded-full self-center mr-1" style={{ backgroundColor: poem?.color }} title={poemType} />
        }
        <p className="text-white">{textInfo}</p>
      </div>
      <div>
        <Link href={url} className="text-white bg-green-600 py-2 px-4 rounded-lg hover:opacity-75">View {linkInfo}</Link>
      </div>
    </div>
  )
}

export default SearchCard;