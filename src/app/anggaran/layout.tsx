"use client";

import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/layout/Sidebar";

export default function AnggaranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden"><Sidebar /><main className="flex-1 min-w-0 w-full overflow-x-hidden overflow-y-auto"><div className="w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-16 lg:pt-8">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
