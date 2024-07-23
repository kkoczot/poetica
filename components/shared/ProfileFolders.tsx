import Link from "next/link";
import { getAllUserFolders } from "@/lib/actions/folder.actions";
import Image from "next/image";

interface Props {
  accountId: string;
  authUserId: string | undefined;
}

async function ProfileFolders({ accountId, authUserId }: Props) {
  const folders = await getAllUserFolders(accountId);
  return (
    <section>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 mt-4 gap-y-8">
        {
          folders.map(folder => {
            if ((accountId != authUserId) && !folder.shared) return;
            return (
              <div key={folder._id} className="flex justify-center w-full items-center py-2 px-2">
                <Link href={`/profile/${accountId}/${folder._id}`} className="p-2 flex flex-col justify-center items-center hover:opacity-80 relative">
                  <div
                    className={`absolute top-1 right-[calc(50%_-_25px)] h-2 w-2 z-[999] rounded-full ${folder.deletable ? folder.shared ? "bg-green-500" : "bg-red-600" : "hidden"}`}
                    title={`${folder.deletable ? folder.shared ? "Shared" : "Not shared" : null}`}
                  />
                  <Image src="/assets/folder.svg" alt="folder icon" width={36} height={36} />
                  <h4 className="mt-1 max-x-lg text-base-regular text-light-2">{folder.title}</h4>
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