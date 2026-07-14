import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-full border-r bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-600">
          LiveDocs
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Document Workspace
        </p>
      </div>

      <nav className="px-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/document"
              className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              My Documents
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/sharedocument"
              className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              Shared With Me
            </Link>
          </li>

          <li>
            <Link
              href="/starred"
              className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              Starred
            </Link>
          </li>

          <li>
            <Link
              href="/trash"
              className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              Trash
            </Link>
          </li>

          <li>
            <Link
              href="/settings"
              className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}