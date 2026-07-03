import SupplementTemplate from "@/component/templates/SupplementTemplate";
import { getItems } from "@/const/function/getItems";
import { getPageMetadata } from "@/const/function/getPageMetadata";
import { getRegulationItems } from "@/const/function/getRegulationItems";
import type { SupplementItemType } from "@/const/type/supplement/SupplementItemType";

export const dynamic = "force-static";
export async function generateMetadata() {
  return await getPageMetadata("SUPPLEMENT");
}

export async function generateStaticParams() {
  const items = await getRegulationItems("list");
  return items.map((item) => ({ period: String(item.id) }));
}

type Props = {
  params: Promise<{ period: string }>;
};

export default async function Supplement({ params }: Props) {
  const { period } = await params;
  const items = await getItems<SupplementItemType>("supplement", { period });
  return <SupplementTemplate items={items} />;
}
