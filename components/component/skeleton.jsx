
import { Skeleton } from "@/components/ui/skeleton"
import { CardContent, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Loading() {
  return (
    <div className="flex flex-col p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <Card className="w-full bg-gradient-to-l  from-[#40916c] to-[#2a6f97]  bg-gradient-to-l  from-[#40916c] to-[#2a6f97] ">
          <Skeleton className="h-32 w-full rounded-md" />
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card className="w-full bg-gradient-to-l  from-[#40916c] to-[#2a6f97] ">
          <Skeleton className="h-32 w-full rounded-md" />
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card className="w-full bg-gradient-to-l  from-[#40916c] to-[#2a6f97] ">
          <Skeleton className="h-32 w-full rounded-md" />
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card className="w-20 bg-gradient-to-l  from-[#40916c] to-[#2a6f97] ">
          <Skeleton className="h-32 w-full rounded-md" />
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card className="w-full bg-gradient-to-l  from-[#40916c] to-[#2a6f97] ">
          <Skeleton className="h-32 w-full rounded-md" />
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card className="w-full bg-gradient-to-l  from-[#40916c] to-[#2a6f97] ">
          <Skeleton className="h-32 w-full rounded-md" />
          <CardContent className="space-y-2 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
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
