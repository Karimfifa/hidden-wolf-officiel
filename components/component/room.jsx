
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { currentUser } from "@clerk/nextjs/server"

export default async function Room() {
  const user = await currentUser();

 
  return (
   

    <>
       <div className="grid grid-cols-1 h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="border-r bg-gray-100/40 p-4 dark:bg-gray-800/40 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Players Online</h3>
          <Button size="icon" variant="ghost">
            <RefreshCwIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-2 overflow-auto">
          <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm dark:bg-gray-950">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage alt="Player 1" src={user?.imageUrl} />
                <AvatarFallback>P1</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.fullName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Online 5 mins</p>
              </div>
            </div>
            <Button size="icon" variant="ghost">
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm dark:bg-gray-950">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage alt="Player 2" src="/placeholder-avatar.jpg" />
                <AvatarFallback>P2</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Player 2</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Online 10 mins</p>
              </div>
            </div>
            <Button size="icon" variant="ghost">
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm dark:bg-gray-950">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage alt="Player 3" src="/placeholder-avatar.jpg" />
                <AvatarFallback>P3</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Player 3</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Online 15 mins</p>
              </div>
            </div>
            <Button size="icon" variant="ghost">
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="relative h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-950 md:rounded-none">
        <img
          alt="Game Canvas"
          className=" w-full object-cover"
          src="https://c4.wallpaperflare.com/wallpaper/378/328/998/moonlit-dark-night-sky-darkness-wallpaper-preview.jpg"
          style={{
            aspectRatio: "500/500",
            objectFit: "contain",
          }}
        />
      </div>
      <div className="fixed bottom-0 w-full col-span-1 flex items-center justify-center border-t bg-gray-100/40 p-4 dark:bg-gray-800/40 md:col-span-2 md:p-6">
        <div className="flex w-full max-w-md items-center justify-between gap-4">
          <Button  variant="outline" type="button" data-drawer-target="drawer-example" data-drawer-show="drawer-example" aria-controls="drawer-example">
            <MessageCircleIcon className="mr-2 h-5 w-5" />
            Chat
          </Button>
          <Button  variant="outline">
            <ThumbsUpIcon className="mr-2 h-5 w-5" />
            Vote
          </Button>
          <Button variant="outline">
            <XIcon className="mr-2 h-5 w-5" />
            Quit
              </Button>
        </div>
      </div>
    </div>

    
<div id="drawer-example" class="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-80 dark:bg-gray-800" tabindex="-1" aria-labelledby="drawer-label">
   <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"><svg class="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>Info</h5>
   <button type="button" data-drawer-hide="drawer-example" aria-controls="drawer-example" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
      <span class="sr-only">Close menu</span>
   </button>
      
   <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Supercharge your hiring by taking advantage of our <a href="#" class="text-blue-600 underline dark:text-blue-500 hover:no-underline">limited-time sale</a> for Flowbite Docs + Job Board. Unlimited access to over 190K top-ranked candidates and the #1 design job board.</p>
   <div class="grid grid-cols-2 gap-4">
      <a href="#" class="px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Learn more</a>
      <a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Get access <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
  </svg></a>
   </div>
</div>
    </>

  )
}

function ChevronRightIcon(props) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}


function MessageCircleIcon(props) {
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
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  )
}


function RefreshCwIcon(props) {
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
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}


function ThumbsUpIcon(props) {
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
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  )
}


function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
