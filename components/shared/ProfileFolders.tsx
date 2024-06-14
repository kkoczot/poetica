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
      <div>
        {
          folders.map(folder => {
            if ((accountId != authUserId) && !folder.shared) return; 
            return (
              <div key={folder._id} className="flex flex-col justify-center w-min items-center py-4">
                <Link href={`/profile/${accountId}/${folder._id}`}>
                  <Image src="/assets/tag.svg" alt="folder icon" width={35} height={35} />
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