import RegulationTemplate from "@/component/templates/RegulationTemplate";
import { getPageMetadata } from "@/const/function/getPageMetadata";
import { getRegulationItems } from "@/const/function/getRegulationItems";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export async function generateMetadata() {
  return await getPageMetadata("REGULATION");
}

export async function generateStaticParams() {
  const items = await getRegulationItems("list");
  return items.map((item) => ({ period: String(item.id) }));
}

type Props = {
  params: Promise<{ period: string }>;
};

export default async function Regulation({ params }: Props) {
  const { period } = await params;
  const regulation = await getRegulationItems("detail", period);
  if (!regulation) notFound();
  return <RegulationTemplate regulation={regulation} />;
}
