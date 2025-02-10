"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Widget } from "@uploadcare/react-widget"

export default function VideoProcessingUI() {
  const [processedVideoUrl, setProcessedVideoUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [docId, setDocId] = useState("") // Store docId to track the job
  const [transformationType, setTransformationType] = useState("")
  const { toast } = useToast()

  const handleFileUpload = (fileInfo: any) => {
    setVideoUrl(fileInfo.cdnUrl)
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (!videoUrl || !transformationType) {
  //     toast({
  //       title: "Error",
  //       description: "Please select a file and enter a transformation type",
  //       variant: "destructive",
  //     })
  //     return
  //   }
  //   setIsProcessing(true)

  //   try {
  //     const response = await fetch("/api/process-video", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         videoUrl: videoUrl,
  //         transformationType,
  //       }),
  //     })

  //     if (!response.ok) throw new Error("Failed to process video")

  //     const data = await response.json()
  //     setDocId(data.docId) // Store docId to track job status
  //     toast({
  //       title: "Success",
  //       description: "Video is being processed...",
  //     })

  //     // Start polling for video completion
  //     pollForProcessedVideo(data.docId)
  //   } catch (error) {
  //     console.error("Error:", error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to upload and process video",
  //       variant: "destructive",
  //     })
  //   }
  // }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !transformationType) {
      toast({
        title: "Error",
        description: "Please select a file and enter a transformation type",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);
  
    try {
      const response = await fetch("/api/process-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: videoUrl,
          transformationType,
        }),
      });
  
      const data = await response.json();
      console.log("API Response from /api/process-video:", data); // Debugging log
  
      if (!data.docId) {
        console.error("docId is missing in API response");
        throw new Error("docId missing in API response");
      }
  
      setDocId(data.docId); // Store docId to track job status
      pollForProcessedVideo(data.docId); // Start polling for video completion
  
      toast({
        title: "Success",
        description: "Video is being processed...",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to upload and process video",
        variant: "destructive",
      });
    }
  };
  

  const pollForProcessedVideo = async (docId: string) => {
    console.log(docId);
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-video-status?docId=${docId}`)
        const result = await res.json()

        if (result.status === "completed" && result.processedVideoUrl) {
          setProcessedVideoUrl(result.processedVideoUrl)
          setIsProcessing(false)
          clearInterval(interval)
          toast({
            title: "Success",
            description: "Video processing complete!",
          })
        }
      } catch (error) {
        console.error("Error checking video status:", error)
      }
    }, 10000) // Poll every 5 seconds
  }

  return (
    <div className="flex flex-col min-h-10 bg-gray-900 text-white">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 p-4 md:p-6 gap-5 md:gap-6">
        {/* Left Panel */}
        <div className="w-full md:min-h-[60vh] md:w-1/2 bg-gray-800 p-4 md:p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
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
            <Button type="submit" disabled={isProcessing} className="w-full">
              {isProcessing ? "Processing..." : "Upload and Process"}
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
