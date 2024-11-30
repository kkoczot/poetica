import Link from "next/link";
import { checkWhatTypeOfFolder, getAllUserFolders } from "@/lib/actions/folder.actions";
import Image from "next/image";
import { poemTypes } from "@/constants";

interface Props {
  accountId: string;
  authUserId: string | undefined;
}

async function ProfileFolders({ accountId, authUserId }: Props) {
  const folders = await getAllUserFolders(accountId);
  const arrayOfTags = await Promise.all(folders.map(async (folder: { _id: string }) => await checkWhatTypeOfFolder(folder._id)));
  // console.log("Folders: ", arrayOfTags);
  return (
    <section>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 mt-4 gap-y-8">
        {
          folders.map((folder, i) => {
            if ((accountId != authUserId) && !folder.shared) return;
            const thisPoemType = poemTypes.filter((poemType: { poemType: string, color: string }) => poemType.poemType == arrayOfTags[i][0])[0] || {};
            console.log("thisPoemType: ", thisPoemType);
            return (
              <div key={folder._id} className="flex justify-center w-full items-center py-2 px-2">
                <Link href={`/profile/${accountId}/${folder._id}`} className="p-2 flex flex-col justify-center items-center hover:opacity-80 relative">
                  <div
                    className={`absolute top-1 right-[calc(50%_-_35px)] h-3 w-3 z-[999] rounded-full ${folder.deletable ? folder.shared ? "bg-green-500" : "bg-red-600" : "hidden"}`}
                    title={`${folder.deletable ? folder.shared ? "Shared" : "Not shared" : null}`}
                  />
                  <div
                    className={`absolute flex justify-center items-center top-1 left-[calc(50%_-_50px)] h-5 w-5 z-[999] rounded-full font-bold text-[1.25rem]  bg-white`}
                    title={`Contains ${folder.poems.length} poems`}
                  >
                    {folder.poems.length}
                  </div>
                  <Image src="/assets/folder.svg" alt="folder icon" width={36} height={36} />
                  <h4 className="mt-1 max-x-lg text-base-regular text-light-2">{folder.title}</h4>
                  <div className={`flex gap-2 items-center ${thisPoemType?.poemType ? "block" : "hidden"}`}>
                    <div
                      className="h-3 w-3"
                      style={{ background: thisPoemType?.color || "white" }}
                      title={`${thisPoemType?.poemType || "No poems"} color`}
                    />
                    <span className="text-white text-[14px] tracking-wide">({thisPoemType?.poemType || ""})</span>
                  </div>
                </Link>
              </div>
            )
          })
        }
      </div>
    </section>
  )
}

export default ProfileFolders;