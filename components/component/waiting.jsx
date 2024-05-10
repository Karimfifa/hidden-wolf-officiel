'use client'
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"

export default function Waiting() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-950 px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded-lg bg-gray-900 p-6 shadow-lg">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Waiting for players</h1>
            <p className="text-gray-400">Join the room and wait for the game to start.</p>
          </div>
          <div className="flex w-full flex-col items-start rounded-md bg-gray-800 px-4 py-3">
            <div className="mb-2 flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">2 players in the room</span>
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <Button className="rounded-md px-4 py-2 text-sm font-medium" variant="primary">
                Close Game
              </Button>
            </div>
            <div className="flex w-full items-center gap-4">
              <Avatar>
                <AvatarImage alt="Player 1" src="/placeholder-avatar.jpg" />
                <AvatarFallback>P1</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-white">Player 1</h3>
                <p className="text-gray-400">Ready</p>
              </div>
              <Avatar>
                <AvatarImage alt="Player 2" src="/placeholder-avatar.jpg" />
                <AvatarFallback>P2</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-white">Player 2</h3>
                <p className="text-gray-400">Ready</p>
              </div>
            </div>
          </div>
          <Button className="w-full rounded-md px-4 py-2 text-sm font-medium" variant="outline">
            Start Game
          </Button>
        </div>
      </div>
    </div>
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
