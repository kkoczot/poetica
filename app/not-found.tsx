import Link from 'next/link';
import 'tailwindcss/base.css'
import 'tailwindcss/components.css'
import 'tailwindcss/utilities.css'

export default function NotFound() {

  return (
    <div className='flex justify-center items-center h-screen bg-dark-1 text-center py-0 px-5'>
      <div className="fixed top-8 right-0 bottom-8 left-0 rounded-xl bg-cover opacity-50"  style={{ backgroundImage: "url(/not-found2.jpg)" }} />
      {/* <div className='fixed top-8 right-5 bottom-8 left-5 rounded-xl bg-cover' /> */}
      <div className='h-max max-w-[1000px] flex justify-center items-center z-10'>
        <div className='p-10 rounded-xl max-sm:p-5'>
          <div className='bg-dark-3 p-10 rounded-2xl'>
            <h1 className='text-[36px] max-sm:text-[30px] mb-4 text-white/90'>
              Alas, the poem you are looking for <br /> has not been written yet
            </h1>
            <p className='text-[20px] mb-8 max-w-[600px] text-[#a3a3a3]'>
              "This page is like a verse, lost in the wind... yet many await your discovery."
            </p>

            <div className='mt-4'>
              <Link href="/" className='text-green-600 bg-dark-2 py-3 px-6 rounded-xl hover:border hover:border-green-700 outline-none'>
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
export default function NotFound() {
  // const colors = ["#FF5733", "#2E4053", "#1ABC9C", "#F39C12", "#8E44AD", "#27AE60", "#3498DB", "#E74C3C", "#34495E", "#95A5A6"];

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-dark-1 text-center py-0 px-5 '>
      <div className='p-20 rounded-2xl'>
      <div className='bg-dark-3 p-10 rounded-2xl'>
        <h1 className='text-[36px] mb-4 text-white/90'>
          Alas, the poem you are looking for <br /> has not been written yet
        </h1>
        <p className='text-[20px] mb-8 max-w-[600px] text-[#a3a3a3]'>
          "This page is like a verse, lost in the wind... yet many await your discovery."
        </p>

        <div className='mt-4'>
          <Link href="/" className='text-green-600 bg-dark-2 py-3 px-6 rounded-xl hover:border'>
            Return to the Verse
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
*/