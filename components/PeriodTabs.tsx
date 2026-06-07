"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <Tabs value={current} onValueChange={navigate}>
      <TabsList>
        {PERIODS.map((p) => (
          <TabsTrigger key={p.key} value={p.key}>{p.label}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
