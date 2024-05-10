'use client'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Chat() {
  return (
    <div className="flex h-[600px] w-full max-w-[800px] flex-col rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:border-gray-800">
      <div className="flex h-[500px] flex-col">
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-[#8BC34A]" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-50">Willow</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hey, have you seen the new wolf den yet?</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-[#FF9800]" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-50">Oak</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No, not yet. I've been busy foraging in the forest.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-[#673AB7]" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-50">Aspen</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  The new den looks amazing! You should check it out.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-[#E91E63]" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-50">Birch</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  I can't wait to see it! I heard there's a new pack of wolves moving in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-gray-200 p-4 dark:border-gray-800">
        <Input
          className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm focus:outline-none dark:bg-gray-800 dark:text-gray-50"
          placeholder="Type your message..."
          type="text"
        />
        <Button
          className="rounded-full bg-[#4CAF50] px-4 py-2 text-sm text-white transition-colors hover:bg-[#43A047] focus:outline-none dark:bg-[#4CAF50] dark:hover:bg-[#43A047]"
          variant="outline"
        >
          Send
        </Button>
      </div>
    </div>
  )
}
