// app/generate/page.tsx
import { Suspense } from "react";
import { GenerateClient } from "@/components/GenerateClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Laster inn...</p>}>
      <GenerateClient />
    </Suspense>
  );
}