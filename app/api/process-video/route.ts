import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req: Request) {
  try {
    const { videoUrl, transformationType } = await req.json();

    // Upload video to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(videoUrl);

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Create a new ObjectId for this document
    const documentId = new ObjectId();

    // Insert initial request into MongoDB with the ObjectId
    await db.collection("videoProcessing").insertOne({
      _id: documentId, // Assign ObjectId explicitly
      sourceVideoUrl: cloudinaryUrl,
      transformationType,
      status: "pending",
      createdAt: new Date(),
    });

    // Construct the webhook URL
    const webhookUrl = `${process.env.WEBHOOK_BASE_URL}/api/webhook?docId=${documentId.toHexString()}`;
    console.log(webhookUrl);

    // Call Fal API with webhook
    const falResponse = await fetch(
      `https://queue.fal.run/fal-ai/hunyuan-video/video-to-video?fal_webhook=${encodeURIComponent(webhookUrl)}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Key ${process.env.FAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: transformationType,
          video_url: cloudinaryUrl,
          strength: 0.95,
        }),
      }
    );

    if (!falResponse.ok) {
      throw new Error(`Fal API request failed: ${falResponse.statusText}`);
    }

    const falResult = await falResponse.json();

    // Store Fal request ID in MongoDB
    await db.collection("videoProcessing").updateOne(
      { _id: documentId }, // Use ObjectId for query
      { $set: { falRequestId: falResult.request_id } }
    );

    return NextResponse.json({ message: "Processing started", requestId: falResult.request_id });
  } catch (error) {
    console.error("Error processing video:", error);
    return NextResponse.json({ error: "Failed to process video" }, { status: 500 });
  }
}
