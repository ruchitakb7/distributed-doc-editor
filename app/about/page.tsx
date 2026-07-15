// app/about/page.tsx

import {
  FileText,
  Users,
  Share2,
  ShieldCheck,
  Save,
  History,
  Mail,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: FileText,
    title: "Create Documents",
    description:
      "Create and organize documents in a clean, distraction-free workspace.",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description:
      "Work together with teammates and see changes instantly as they happen.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Invite collaborators using their email address and start working together.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Assign Editor or Viewer permissions to control document access.",
  },
  {
    icon: Save,
    title: "Auto Save",
    description:
      "Every change is automatically saved, so your work is never lost.",
  },
//   {
//     icon: History,
//     title: "Version History",
//     description:
//       "Review previous versions of your documents and restore them whenever needed.",
//   },
//   {
//     icon: Mail,
//     title: "Email Invitations",
//     description:
//       "Collaborators receive an email notification when a document is shared.",
//   },
  {
    icon: ShieldCheck,
    title: "Secure Workspace",
    description:
      "Only authenticated users with the correct permissions can access documents.",
  },
];

const benefits = [
  "Real-time collaborative editing",
  "Document sharing with permissions",
  "Automatic saving",
//   "Version history",
  "Secure authentication",
//   "Email invitations",
  "Simple and responsive interface",
  "Perfect for teams and students",
];

export default function AboutPage() {
  return (
    <main className="bg-[#f8f8f8]">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-4 py-1 text-sm font-medium text-gray-700">
              Distributed Document Editor
            </span>

            <h1 className="mt-6 text-5xl font-serif text-[#222]">
              Collaborate Without Limits
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-500">
              Create, edit, and share documents with your team in real time.
              Whether you're working on notes, reports, or project
              documentation, everyone stays synchronized with automatic saving
              and secure role-based access.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-serif text-[#222]">
            Everything You Need
          </h2>

          <p className="mt-3 text-gray-500">
            Powerful features designed to make document collaboration simple,
            secure, and efficient.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6 text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <Icon className="h-6 w-6 text-gray-700" />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-[#222]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-serif text-[#222]">
              Why Choose This Platform?
            </h2>

            <p className="mt-4 leading-7 text-gray-500">
              Built to simplify teamwork, our platform provides everything you
              need for creating, editing, and managing documents with your team
              in one place.
            </p>

            <div className="mt-8 grid gap-4">
              {benefits.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-[#222]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#222] p-10 text-white">
            <h3 className="text-3xl font-serif">
              Built for Better Collaboration
            </h3>

            <p className="mt-6 leading-8 text-gray-300">
              Whether you're working on college assignments, project
              documentation, meeting notes, or team reports, our platform helps
              everyone stay connected through real-time collaboration, automatic
              saving, secure sharing, and version tracking.
            </p>

            <div className="mt-10 rounded-xl bg-white/5 p-5">
              <p className="font-semibold">
                ✔ Collaborate in real time
              </p>

              <p className="mt-2 font-semibold">
                ✔ Share documents securely
              </p>

              <p className="mt-2 font-semibold">
                ✔ Never lose your work
              </p>

              <p className="mt-2 font-semibold">
                ✔ Manage permissions easily
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl rounded-2xl bg-[#222] px-8 py-16 text-center text-white">
          <h2 className="text-4xl font-serif">
            Start Collaborating Today
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Create, edit, and share documents effortlessly with your team—all
            from one secure and collaborative workspace.
          </p>

          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-[#222] transition hover:bg-gray-200"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}