
import Link from "next/link"

export default function Closed() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="max-w-md p-8 rounded-lg bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Room Not Found Or Closed .</h1>
        <p className="text-lg mb-8">The room you were trying to access is either closed or has finished.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-300"
            href="create"
          >
            Create New Room
          </Link>
          <Link
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-colors duration-300"
            href="/game"
          >
            Go to Main Page
          </Link>
        </div>
      </div>
    </div>
  )
}
