"use client";

import { useRouter } from "next/navigation";

export default function MobileBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-3 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-200 md:hidden"
    >
      ← Back
    </button>
  );
}