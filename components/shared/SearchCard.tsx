import Image from "next/image";
import Link from "next/link"

interface Params {
  type: "author" | "folder" | "poem";
  textInfo: string;
  img?: string;
  url: string;
  linkInfo: string;
}

const SearchCard = ({ type, textInfo, img, url, linkInfo }: Params) => {
  return (
    <div className="flex justify-between py-5 px-10 my-4 bg-dark-3 rounded-lg items-center">
      <div className="flex gap-2">
        {
          type === "author" && <Image src={img!} alt="Author's avatar" width={26} height={26} className="border-2 border-green-600 rounded-full" />
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