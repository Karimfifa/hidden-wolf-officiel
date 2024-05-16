
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function InvitationPopup({roomId,roomName,sender}) {
  return (
    <div>
      <div className="bg-red-400">
        <div className="fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4 sm:p-6 w-full sm:w-auto max-w-[360px] sm:max-w-[420px] pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <div className="[&:not(:last-child)]:mb-2 group bg-gray-500  dark:bg-gray-600 shadow-lg rounded-lg p-4 grid grid-cols-[25px_1fr] items-start gap-4 pointer-events-auto animate-in slide-in-from-bottom-5 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in fade-in-90 data-[state=closed]:animate-out fade-out-80 data-[swipe=move]:animate-out fade-out-x-100 data-[swipe=end]:animate-out fade-out-x-100">
            <Image src={'/assets/wolf.png'} height={300} width={300} className="h-8 w-8 rounded-full  bg-gradient-to-r from-[#1b4332] to-[#2a6f97] flex items-center justify-center text-white font-bold" />
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Join {sender} Room</h3>
              <p className="text-gray-500 dark:text-gray-400">
                You've been invited by {sender} to join the {roomName} Room .
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <Link href="#">
                <Button variant="outline">Decline</Button>
              </Link>
              <Link href={`/waiting?uid=${roomId}`}>
                <Button>Join</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}