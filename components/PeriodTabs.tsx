"use client";
import { useRouter, useSearchParams } from "next/navigation";

const PERIODS = [
  { key: "all", label: "All Time" },
  { key: "daily", label: "Today" },
  { key: "weekly", label: "This Week" },
  { key: "monthly", label: "This Month" },
];

export default function PeriodTabs({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (period: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 w-fit">
      {PERIODS.map((p) => (
        <button
          key={p.key}
          onClick={() => navigate(p.key)}
          className={`px-3 py-1.5 rounded-md text-sm transition-all ${
            current === p.key
              ? "bg-zinc-700 text-white font-medium"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
