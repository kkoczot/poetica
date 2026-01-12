import { ObjectId } from "mongoose";
import Image from "next/image";
import Link from "next/link";

interface Author {
  _id: ObjectId;
  id: string;
  image: string;
  name: string;
  username: string;
}

interface Folder {
  _id: ObjectId;
  title: string;
  shared: boolean;
}

interface Poem {
  _id: ObjectId;
  authorId: Author;
  folderId: Folder;
  title: string;
  type: string;
  tags: string[];
  content: string;
  favourite: ObjectId[];
  comments: any[]; // Update this if you have a defined structure for comments
  __v: number;
}

const PoemPost = ({ poem, poemType }: { poem: Poem, poemType: { poemType: string, color: string } }) => {
  return (
    <div className="my-14 p-4 pb-6 rounded-lg bg-dark-3 text-white">
      <div className="flex flex-col items-start relative">
        <div title={'@' + poem.authorId.username} className="absolute top-2 right-2 h-11 w-11 rounded-full border-2 border-green-700 flex items-center overflow-hidden">
          <Link href={`/profile/${poem.authorId.id}`} >
            <Image src={poem.authorId.image} alt={'@' + poem.authorId.username} width={64} height={64} className="opacity-50" />
          </Link>
        </div>
        <Link href={`/profile/${poem.authorId.id}/${poem.folderId._id}/${poem._id}`}><h3 className="text-[22px] font-semibold">{poem.title}</h3></Link>
        <div className="mb-4 italic opacity-80 flex flex-col cursor-default items-start">
          <div className="flex">
            <div className="h-3 w-3 rounded-full self-center mr-1" style={{ backgroundColor: poemType.color }} />
            <h4 className="self-start" title="Poem type">{poem.type}</h4>
          </div>
          <Link href={`/profile/${poem.authorId.id}`}>
            <h4 className="self-start" title="Author">@{poem.authorId.username}</h4>
          </Link>
          <Link href={`/profile/${poem.authorId.id}/${poem.folderId._id}`}>
            <h4 className="self-start mb-2" title="Folder">{poem.folderId.title}</h4>
          </Link>
          <div>
            {poem.tags?.map((tag: string, i: number) => <Link key={`#${i}_${tag}`} href={`/tags/${tag}`}><h4>#{tag}</h4></Link>)}
          </div>
        </div>
      </div>
      <p className="text-light-2 whitespace-break-spaces">{poem.content}</p>
    </div>
  )
}

export default PoemPost