import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import QuickActions from "./Quickaction";
import RecentDocuments from "./Recentdocument";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />

      <main className="flex-1 p-8">
        <DashboardHeader />

        <QuickActions />

        <RecentDocuments />
      </main>
    </div>
  );
}

// import Sidebar from "./Sidebar";

// export default function DashboardLayout() {
//   return (
//     <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <section className="flex-1 p-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Dashboard
//           </h1>

//           <p className="mt-2 text-gray-600">
//             Welcome back! Manage your documents and collaborate with your team.
//           </p>
//         </div>

//         {/* Quick Actions */}
//         <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
//           <h2 className="mb-4 text-xl font-semibold">
//             Quick Actions
//           </h2>

//           <button className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
//             + New Document
//           </button>
//         </div>

//         {/* Recent Documents */}
//         <div className="rounded-xl border bg-white p-6 shadow-sm">
//           <h2 className="mb-6 text-xl font-semibold">
//             Recent Documents
//           </h2>

//           <div className="text-gray-500">
//             No documents found.
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

