// app/generate/page.tsx
import dynamic from "next/dynamic";

// Importer klientkomponenten dynamisk
const GeneratePageClient = dynamic(() => import("@/components/GeneratePageClient"), {
  ssr: false,
});

export default function Page() {
  return <GeneratePageClient />;
}