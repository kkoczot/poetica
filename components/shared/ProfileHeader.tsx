import Link from "next/link";
import Image from "next/image";
import HandleFollowBtn from "../interactiveElements/HandleFollowBtn";

interface Props {
  accountId: string;
  authUserId: string | undefined;
  name: string;
  username: string;
  image: string;
  bio: string;
  follow?: string | undefined;
  followers: number;
  following: number;
}

// Rozbij na mniejsze ponieważ w pewnych sytuacjach wyskakuje błąd odnośnie "use client" związane z (un)follołowaniem dostępnym tylko dla zalogowanych!
async function ProfileHeader({ accountId, authUserId, name, username, image, bio, follow, followers, following }: Props) {
  return (
    <section>
      <div className='flex w-full flex-col justify-start'>
        <div className='flex items-center justify-between max-md:flex-col max-md:items-start gap-y-4'>
          <div>
          <div className='flex items-center gap-3'>
            <div className='relative h-20 w-20 object-cover'>
              <Image
                src={image}
                alt='logo'
                fill
                className='rounded-full object-cover shadow-2xl'
              />
            </div>

            <div className='flex-1'>
              <h2 className='text-left text-heading3-bold text-light-1'>
                {name}
              </h2>
              <p className='text-base-medium text-gray-1'>@{username}</p>
            </div>
          </div>
          <div>
            <span className="text-white">Followers: {followers} | Following: {following}</span>
          </div>
          </div>
          <div className="flex gap-4">
            {accountId === authUserId && (
              <>
                <Link href='/profile/edit'>
                  <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
                    <Image
                      src='/assets/edit.svg'
                      alt='edit profile'
                      width={16}
                      height={16}
                    />
                    <p className='text-light-2'>Edit</p>
                  </div>
                </Link>
                <Link href="/create-folder">
                  <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
                    <Image
                      src='/assets/edit.svg'
                      alt='create folder'
                      width={16}
                      height={16}
                    />
                    <p className="text-light-2">New Folder</p>
                  </div>
                </Link>
              </>
            )}
            {authUserId !== "xd" && accountId !== authUserId && (
              <HandleFollowBtn authUserId={JSON.parse(JSON.stringify(authUserId))} userId={accountId} follow={follow} />
            )}
          </div>
        </div>

        <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>

        <div className='mt-12 h-0.5 w-full bg-dark-3' />
      </div>
    </section>
  )
}

export default ProfileHeader;