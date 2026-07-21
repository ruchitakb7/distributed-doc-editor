import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import QuickActions from "./Quickaction";
import RecentDocuments from "./Recentdocument";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* <Sidebar /> */}

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <DashboardHeader />

        <QuickActions />

        <RecentDocuments />
      </main>
    </div>
  );
}


