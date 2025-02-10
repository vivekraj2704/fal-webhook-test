// "use client"

// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"

// interface HistoryItem {
//   _id: string
//   sourceVideoUrl: string
//   transformationType: string
//   generatedVideoUrl: string
//   createdAt: string
// }

// export default function HistoryDialog() {
//   const [history, setHistory] = useState<HistoryItem[]>([])

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const response = await fetch("/api/history")
//         if (!response.ok) throw new Error("Failed to fetch history")
//         const data = await response.json()
//         console.log(data);
//         setHistory(data)
//       } catch (error) {
//         console.error("Error fetching history:", error)
//       }
//     }

//     fetchHistory()
//   }, [])

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">View History</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Processing History</DialogTitle>
//         </DialogHeader>
//         <div className="mt-4 space-y-4">
//           {history.map((item) => (
//             <div key={item._id} className="border p-4 rounded-md">
//               <p>
//                 <strong>Source:</strong> {item.sourceVideoUrl}
//               </p>
//               <p>
//                 <strong>Type:</strong> {item.transformationType}
//               </p>
//               <p>
//                 <strong>Result:</strong>{" "}
//                 <a
//                   href={item.generatedVideoUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:underline"
//                 >
//                   Download
//                 </a>
//               </p>
//               <p>
//                 <strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  _id: string;
  sourceVideoUrl: string;
  transformationType: string;
  falRequestId: string;
  createdAt: string;
}

export default function HistoryDialog() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/history");
        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();

        // Ensure we extract the correct array from API response
        setHistory(data.data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">View History</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Processing History</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4 w-full h-[600px] overflow-scroll">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : history.length === 0 ? (
            <p className="text-gray-500">No history available.</p>
          ) : (
            history.map((item) => (
              <div key={item._id} className="border p-4 rounded-md">
                <p>
                  <strong>Source:</strong>{" "}
                  <a
                    href={item.sourceVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Source
                  </a>
                </p>
                <p>
                  <strong>Type:</strong> {item.transformationType}
                </p>
                <p>
                  <strong>Result:</strong>{" "}
                  <a
                    href={item.falRequestId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Download
                  </a>
                </p>
                <p>
                  <strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
