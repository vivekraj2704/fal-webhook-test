// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const docId = searchParams.get("docId");

//     if (!docId || !ObjectId.isValid(docId)) {
//       return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
//     }

//     const { db } = await connectToDatabase();
//     const videoProcessing = await db.collection("videoProcessing").findOne({ _id: new ObjectId(docId) });

//     if (!videoProcessing) {
//       return NextResponse.json({ error: "Video not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       status: videoProcessing.status,
//       processedVideoUrl: videoProcessing.processedVideoUrl || null,
//     });
//   } catch (error) {
//     console.error("Error fetching video status:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const docId = searchParams.get("docId");

    console.log("Received docId:", docId); // Debugging log

    if (!docId) {
      console.error("Error: Missing document ID");
      return NextResponse.json({ error: "Missing document ID" }, { status: 400 });
    }

    if (!ObjectId.isValid(docId.trim())) { // Trim to remove hidden characters
      console.error("Error: Invalid document ID format:", docId);
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    const objectId = new ObjectId(docId.trim());
    console.log("Converted ObjectId:", objectId); // Debugging log

    const { db } = await connectToDatabase();
    const videoProcessing = await db.collection("videoProcessing").findOne({ _id: objectId });

    if (!videoProcessing) {
      console.error("Error: Video not found in DB");
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: videoProcessing.status,
      processedVideoUrl: videoProcessing.processedVideoUrl || null,
    });
  } catch (error) {
    console.error("Error fetching video status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
