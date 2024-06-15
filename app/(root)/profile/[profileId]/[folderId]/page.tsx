import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchFolder } from "@/lib/actions/folder.actions";
import Image from "next/image";
import DeleteFolderBtn from "@/components/interactiveElements/DeleteFolderBtn";
import Link from "next/link";
import PoemCard from "@/components/cards/PoemCard";

const Page = async ({ params }: { params: { profileId: string, folderId: string } }) => {
  const user = await currentUser();
  if (user) {
    const authUser = await fetchUser(user?.id);
    if (!authUser?.onboarded) redirect("/onboarding");
  }
  
  const fetchedFolder = await fetchFolder(params.folderId);
  
  if (!fetchedFolder) redirect(`/profile/${params.profileId}`);
  console.log(fetchedFolder);
if (!fetchedFolder.shared && user?.id !== params.profileId) redirect(`/profile/${params.profileId}`);
  const showPoems = fetchedFolder.shared || (user && user.id === params.profileId); //
  const pathname = `/profile/${params.profileId}/${params.folderId}`;

  return (
    <section>
      <div>
        <div className='flex items-left mb-10 flex-col 2xl:flex-row 2xl:justify-between gap-y-4'>
          <h1 className="head-text">Folder: {fetchedFolder.title}</h1>
          <div className="flex flex-row gap-4">
            {
              user && user.id === params.profileId && fetchedFolder.deletable && ( //
                <Link href={`/profile/${params.profileId}/${params.folderId}/edit`}>
                  <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 hover:bg-dark-2'>
                    <Image
                      src='/assets/edit.svg'
                      alt='logout'
                      width={16}
                      height={16}
                    />
                    <p className='text-light-2 max-sm:hidden'>Edit</p>
                  </div>
                </Link>
              )
            }
            {
              user && user.id === params.profileId && ( //
                <Link href={`/profile/${params.profileId}/${params.folderId}/create-poem`}>
                  <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 hover:bg-dark-2">
                    <Image
                      src='/assets/edit.svg'
                      alt='logout'
                      width={16}
                      height={16}
                    />
                    <p className="text-light-2">Create poem</p>
                  </div>
                </Link>
              )
            }
            {
              user && user.id === params.profileId && fetchedFolder.deletable && ( //
                <DeleteFolderBtn authorId={JSON.parse(JSON.stringify(params.profileId))} folderId={params.folderId} /> //
              )
            }
          </div>
        </div>
        <p className="mt-1 max-x-lg text-base-regular text-light-2">Folder is {fetchedFolder.shared ? "" : "NOT"} shared.</p>
        <p className="mt-2 max-x-lg text-base-regular text-light-2">{fetchedFolder.description}</p>
        <div className='mt-12 h-0.5 w-full bg-dark-3' />
      </div>
      <div className="mt-10">
        {/* <div className="flex sm:flex-col justify-between gap-4"> */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-12 gap-x-6">
          {
            showPoems && (fetchedFolder.poems.length < 1 ? (<p className="text-red-500">No poems here yet!</p>) : (
              fetchedFolder.poems.map((poem: string) => <PoemCard key={poem} pathname={pathname} poemId={JSON.parse(JSON.stringify(poem))} own={Boolean(user && user.id === params.profileId)} authUserId={user?.id} />)
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default Page;