// import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/mongodb"

// export async function GET() {
//   try {
//     const { db } = await connectToDatabase()
//     const history = await db
//       .collection("videoProcessing")
//       .find({ status: "completed" })
//       .sort({ completedAt: -1 })
//       .limit(10)
//       .toArray()

//     return NextResponse.json(history)
//   } catch (error) {
//     console.error("Error fetching history:", error)
//     return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")

    const history = await db
      .collection("videoProcessing")
      .find({ status: "completed" })
      .sort({ completedAt: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({ data: history || [] }, { status: 200 })
  } catch (error) {
    //@ts-ignore
    console.error("Error fetching history:", error.message)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
