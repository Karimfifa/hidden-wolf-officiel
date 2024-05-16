
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"

export default function AboutPage() {
  return (
    <div key="1" className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#3B2F4A] to-[#7A5D7E]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <img
                alt="Features"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                height="550"
                src="/assets/wolf.png"
                width="550"
              />
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  About Game
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                  Explore, Solve, and Uncover
                </h2>
                <p className="max-w-[600px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hidden Wolf offers a captivating adventure filled with challenging puzzles, immersive exploration, and
                  a deep narrative that will keep you engaged from start to finish. Discover hidden secrets, uncover the
                  truth, and embark on an unforgettable journey.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                    href="/game"
                  >
                    Play Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
