// export async function callFalApi(videoUrl: string, transformationType: string) {
//   console.log(`the video url is ${videoUrl}`);
//   const response = await fetch("https://api.fal.ai/hunyuan-video", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.FAL_API_KEY}`,
//     },
//     body: JSON.stringify({
//       input_video: videoUrl,
//       transformation_type: transformationType,
//       webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`,
//     }),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to call Fal API")
//   }

//   return response.json()
// }

