"use client";

import { GenerateForm } from "@/components/generate-form";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain") ?? "helse";
  const challenge = searchParams.get("challenge") ?? "";

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generer en treningscase</h1>
      <GenerateForm mainCategory={domain as any} challengeScenario={challenge} />
    </div>
  );
}