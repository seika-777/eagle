import RegulationTemplate from "@/component/templates/RegulationTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
import { getRegulationItems } from "@/const/function/getRegulationItems";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.REGULATION,
  description: METADATA.DESCRIPTION.REGULATION,
};

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
