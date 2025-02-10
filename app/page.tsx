import VideoUploadForm from "@/components/VideoUploadForm"
import HistoryDialog from "@/components/HistoryDialog"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-zinc-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-gray-800 pb-4">
          <h1 className="text-xl font-semibold">Transform videos with prompt</h1>
          <HistoryDialog>
          </HistoryDialog>
        </header>
        <VideoUploadForm />
      </div>
    </div>
  )
}

