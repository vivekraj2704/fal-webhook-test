import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  videoUploader: f({ video: { maxFileSize: "64MB" } }).onUploadComplete(async ({ file }) => {
    console.log("Upload complete for", file.name)
    console.log("File URL", file.url)
    // You can run any code here after upload is complete
    // For example, you could send this URL to your API to process the video
  }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

