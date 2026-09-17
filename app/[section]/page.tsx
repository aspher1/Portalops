import { notFound } from "next/navigation";
import { SectionPage } from "@/components/section-page";

const sections = new Set([
  "workflows", "runs", "approvals", "agents", "evidence", "integrations", "settings",
  "product", "security", "pricing", "demo", "help",
]);

export default async function DynamicSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!sections.has(section)) notFound();
  return <SectionPage section={section} />;
}
