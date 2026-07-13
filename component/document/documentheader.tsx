// "use client";

// import Link from "next/link";
// import { ArrowLeft, Share2, History } from "lucide-react";
// import { Button } from "@/component/ui/button";

// interface DocumentHeaderProps {
//   title?: string;
// }

// export default function DocumentHeader({
//   title = "Untitled Document",
// }: DocumentHeaderProps) {
//   return (
//     <header className="sticky top-0 z-50 border-b bg-white">
//       <div className="mx-auto flex h-16 items-center justify-between px-6">
//         <div className="flex min-w-0 items-center gap-4">
     
//           <div className="min-w-0">
//             <input
//               type="text"
//               value={title}
//               readOnly
//               className="w-full border-none bg-transparent text-lg font-semibold text-gray-900 outline-none"
//             />
//             <p className="text-sm text-gray-500">Last saved • Just now</p>
//           </div>
//         </div>

//         {/* Right */}
//         <div className="flex items-center gap-3">
//           <Button variant="outline" size="sm">
//             <History className="mr-2 h-4 w-4" />
//             Version 1
//           </Button>

//           <Button size="sm">
//             <Share2 className="mr-2 h-4 w-4" />
//             Share
//           </Button>
//         </div>
//       </div>
//     </header>
//   );
// }


"use client";

import { Share2, History } from "lucide-react";
import { Button } from "@/component/ui/button";

interface DocumentHeaderProps {
  document: any;
}

export default function DocumentHeader({
  document,
}: DocumentHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="min-w-0">
            <input
              type="text"
              value={document?.title ?? "Untitled Document"}
              readOnly
              className="w-full border-none bg-transparent text-lg font-semibold text-gray-900 outline-none"
            />

            <p className="text-sm text-gray-500">
              Last saved • Just now
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <History className="mr-2 h-4 w-4" />
            Version 1
          </Button>

          <Button size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </header>
  );
}