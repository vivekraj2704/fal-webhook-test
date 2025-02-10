"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useUploadThing } from "@/lib/uploadthing"
import { useDropzone } from 'react-dropzone';
import { Textarea } from "@/components/ui/textarea";
import { Widget } from "@uploadcare/react-widget";

export default function VideoProcessingUI() {
  const [processedVideoUrl, setProcessedVideoUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const [videoUrl, setVideoUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [transformationType, setTransformationType] = useState("")
  const { startUpload, isUploading } = useUploadThing("videoUploader")

  const handleFileUpload = (fileInfo: any) => {
    setVideoUrl(fileInfo.cdnUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl || !transformationType) {
      toast({
        title: "Error",
        description: "Please select a file and transformation type",
        variant: "destructive",
      })
      return
    }
    setIsProcessing(true)

    try {
        const response = await fetch("/api/process-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoUrl: videoUrl,
            transformationType,
          }),
        })

        if (!response.ok) throw new Error("Failed to process video")

        const data = await response.json()
        setProcessedVideoUrl(data.link)
        toast({
          title: "Success",
          description: "Video processed",
        })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to upload and process video",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col min-h-10 bg-gray-900 text-white">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 p-4 md:p-6 gap-5 md:gap-6">
        {/* Left Panel */}
        <div className="w-full md:min-h-[60vh] md:w-1/2 bg-gray-800 p-4 md:p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* <Input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="md:file:ml-[20%] file:py-2 file:px-6 file:rounded-md file:border-0 file:text-lg file:font-semibold file:bg-violet-50 file:text-violet-700 hover:bg-violet-100 text-black w-full mt-[30px] p-[30px] h-full"
            /> */}
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer">
            <Widget publicKey="59246653fdb28d52a88d" onChange={handleFileUpload} />
            </div>
            <Input
              type="text"
              placeholder="Enter transformation type"
              value={transformationType}
              className="text-black w-full mt-[40px]"
              onChange={(e) => setTransformationType(e.target.value)}
            />
            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? "Uploading..." : "Upload and Process"}
            </Button>
          </form>
        </div>
        {/* Right Panel (Result) */}
        <div className="w-full md:w-1/2 bg-gray-800 p-4 md:p-6 rounded-lg flex flex-col items-center justify-center relative min-h-[300px]">
          <h2 className="absolute top-4 left-6 text-lg font-semibold">Result</h2>
          {isProcessing ? (
            <Loader2 className="animate-spin h-12 w-12 text-gray-400" />
          ) : processedVideoUrl ? (
            <div className="w-full">
              <video controls className="w-full rounded-lg">
                <source src={processedVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="mt-4 break-all">
                <a
                  href={processedVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {processedVideoUrl}
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Processed video will appear here</p>
          )}
        </div>
      </div>
    </div>
  )
}

