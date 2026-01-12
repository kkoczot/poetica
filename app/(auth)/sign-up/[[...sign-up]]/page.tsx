import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (<div className="flex flex-col items-center justify-center min-h-screen py-8">
    <div className="flex flex-col gap-4">
      <SignUp />
      <Link href="/" className="inline-flex min-w-max mx-5 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary-foreground hover:bg-green-700/50 h-12 px-4 py-2 bg-green-700">
        Back to home page
      </Link>
    </div>
  </div>);
}