"use client";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        <main className="max-w-5xl mx-auto px-8 py-12">
          <h2 className="text-xl font-semibold">Loading profile...</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <main className="max-w-4xl mx-auto px-10 py-12">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif text-[#222]">
            Profile
          </h1>

          <p className="mt-2 text-gray-500">
            View your account information.
          </p>
        </div>

   
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex justify-between items-center">

     
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-2 border-green-300 bg-primary/10 text-primary flex items-center justify-center text-5xl font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-8">

              <div>
                <p className="uppercase tracking-[0.2em] text-[11px] text-gray-400">
                  Name
                </p>

                <p className="mt-2 text-lg text-gray-900">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="uppercase tracking-[0.2em] text-[11px] text-gray-400">
                  Email
                </p>

                <p className="mt-2 text-lg text-gray-900">
                  {user.email}
                </p>
              </div>

              <button
                className="mt-4 rounded-lg bg-primary px-6 py-3 text-white font-medium hover:opacity-90 transition"
              >
                Edit Profile
              </button>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}