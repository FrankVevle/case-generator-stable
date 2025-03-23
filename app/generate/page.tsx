// app/generate/page.tsx
import dynamic from "next/dynamic";

// Importer klient-komponenten dynamisk med SSR deaktivert
const GeneratePageClient = dynamic(() => import("@/components/GeneratePageClient"), {
  ssr: false,
});

export default function Page() {
  return <GeneratePageClient />;
}
