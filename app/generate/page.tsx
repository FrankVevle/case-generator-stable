// app/generate/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { GenerateClient } from "@/components/GenerateClient";

export default function Page() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Generer treningscase</h1>
      <Suspense fallback={<p>Laster klient...</p>}>
        <GenerateClient />
      </Suspense>
    </div>
  );
}