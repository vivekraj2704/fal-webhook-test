import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ObjectId } from "mongodb"; 

export async function POST(req: Request) {
  console.log("Webhook received!");

  try {
    console.log("Request Headers:", req.headers);
    const body = await req.json();
    console.log("Request Body:", JSON.stringify(body, null, 2));

    const { searchParams } = new URL(req.url);
    let docId = searchParams.get("docId");

    if (!docId) {
      console.error("Error: Missing document ID");
      return NextResponse.json({ error: "Missing document ID" }, { status: 400 });
    }

    // Trim and validate docId
    docId = docId.trim(); // Remove any hidden characters

    if (!ObjectId.isValid(docId)) {
      console.error(`Invalid document ID format: ${docId}`);
      return NextResponse.json({ error: "Invalid document ID format" }, { status: 400 });
    }

    const objectId = new ObjectId(docId);
    console.log(`Processing document ID: ${objectId}`);

    const { request_id, status, payload: responsePayload } = body;

    // Validate Fal's response
    if (status !== "OK") {
      console.error("Fal Processing Error:", body);
      return NextResponse.json({ error: "Fal processing failed" }, { status: 500 });
    }

    if (!responsePayload || !responsePayload.video || !responsePayload.video.url) {
      console.error("Invalid Payload Received:", responsePayload);
      return NextResponse.json({ error: "Invalid payload received from Fal" }, { status: 400 });
    }

    const processedVideoUrl = responsePayload.video.url;
    console.log(`Received processed video URL: ${processedVideoUrl}`);

    // Upload the processed video to Cloudinary
    const cloudinaryLink = await uploadToCloudinary(processedVideoUrl);
    console.log(`Uploaded to Cloudinary: ${cloudinaryLink}`);

    // Update MongoDB with the processed video URL
    const { db } = await connectToDatabase();
    const updateResult = await db.collection("videoProcessing").updateOne(
      { _id: objectId },
      {
        $set: {
          falRequestId: request_id,
          processedVideoUrl: cloudinaryLink,
          status: "completed",
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      console.error("MongoDB Update Failed: No document found");
      return NextResponse.json({ error: "MongoDB update failed" }, { status: 500 });
    }

    console.log("Webhook processed successfully!");
    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
