import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next"



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hidden Wolf",
  description: "THE HIDDEN WOLF GAME FROM MORROCO",
  openGraph:{
    title: "Hidden Wolf",
    description: "Hidden wolf morroco"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          
        <div className="px-4  lg:px-6 h-14 flex items-center justify-between bg-gradient-to-r from-black to-gray-900">
        <Link className="flex items-center" href="/game">
          <DogIcon className="h-6 w-6" />
          <span className="">Hidden Wolf</span>
        </Link>
        <div className="flex items-center gap-2">
          <SignedOut>
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-[#5F4B8B] shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                href="#"
              >
                <SignInButton></SignInButton>
              </Link>
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 border-[#5F4B8B] bg-[#5F4B8B] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#5F4B8B]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800"
                href="#"
              >
                <SignUpButton />
              </Link>
          </SignedOut>


          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
          
          
          
          
          
          
          
          
          
          {children}</body>
      </html>
    </ClerkProvider>
    
  );
}




function DogIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
      <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
      <path d="M8 14v.5" />
      <path d="M16 14v.5" />
      <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
      <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
    </svg>
  )
}


function MenuIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}