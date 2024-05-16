
import Link from "next/link"

export default function Navigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-2 px-4 md:py-3 md:px-6 flex flex-col md:flex-row justify-between items-center">
      <div className="flex justify-around w-full md:hidden">
        <Link
          className="flex justify-center items-center py-2 md:py-3 text-sm md:text-base font-medium transition-colors hover:bg-gray-800 focus:bg-gray-800 data-[active=true]:bg-indigo-600"
          href="create"
        >
          <PlusIcon className="w-5 h-5" />
        </Link>
        <Link
          className="flex justify-center items-center py-2 md:py-3 text-sm md:text-base font-medium transition-colors hover:bg-gray-800 focus:bg-gray-800 data-[active=true]:bg-indigo-600"
          href="friends"
        >
          <UsersIcon className="w-5 h-5" />
        </Link>
        <Link
          className="flex justify-center items-center py-2 md:py-3 text-sm md:text-base font-medium transition-colors hover:bg-gray-800 focus:bg-gray-800 data-[active=true]:bg-indigo-600"
          href="store"
        >
          <ShoppingCartIcon className="w-5 h-5" />
        </Link>
        {/* <Link
          className="flex justify-center items-center py-2 md:py-3 text-sm md:text-base font-medium transition-colors hover:bg-gray-800 focus:bg-gray-800 data-[active=true]:bg-indigo-600"
          href="#"
        >
          <ContactIcon className="w-5 h-5" />
        </Link> */}
      </div>
      <div className="hidden md:flex flex-1 justify-between items-center">
        <Link
          className="flex justify-center items-center py-2 md:py-3 text-sm md:text-base font-medium transition-colors hover:bg-gray-800 focus:bg-gray-800 data-[active=true]:bg-indigo-600"
          href="create"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          <span>Create Room</span>
        </Link>
        <Link
          className="flex justify-center items-center py-2 md:py-3 text-sm md:text-base font-medium transition-colors hover:bg-gray-800 focus:bg-gray-800 data-[active=true]:bg-indigo-600"
          href="friends"
        >
          <UsersIcon className="w-5 h-5 mr-2" />
          <span>Friends</span>
        </Link>
        <Link
          className="flex justify-center items-center py-2 md:py-3 text-sm md:text-base font-medium transition-colors hover:bg-gray-800 focus:bg-gray-800 data-[active=true]:bg-indigo-600"
          href="store"
        >
          <ShoppingCartIcon className="w-5 h-5 mr-2" />
          <span>Store</span>
        </Link>
        {/* <Link
          className="flex justify-center items-center py-2 md:py-3 text-sm md:text-base font-medium transition-colors hover:bg-gray-800 focus:bg-gray-800 data-[active=true]:bg-indigo-600"
          href="#"
        >
          <ContactIcon className="w-5 h-5 mr-2" />
          <span>Chat</span>
        </Link> */}
      </div>
    </div>
  )
}

function ContactIcon(props) {
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
      <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <circle cx="12" cy="10" r="2" />
      <line x1="8" x2="8" y1="2" y2="4" />
      <line x1="16" x2="16" y1="2" y2="4" />
    </svg>
  )
}


function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function ShoppingCartIcon(props) {
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}


function UsersIcon(props) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
