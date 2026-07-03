import RaceTemplate from "@/component/templates/RaceTemplate";
import { getItems } from "@/const/function/getItems";
import { getPageMetadata } from "@/const/function/getPageMetadata";
import { getRegulationItems } from "@/const/function/getRegulationItems";
import type { RaceItemType } from "@/const/type/race/RaceItemType";

export const dynamic = "force-static";
export async function generateMetadata() {
  return await getPageMetadata("RACE");
}

export async function generateStaticParams() {
  const items = await getRegulationItems("list");
  return items.map((item) => ({ period: String(item.id) }));
}

type Props = {
  params: Promise<{ period: string }>;
};

export default async function Race({ params }: Props) {
  const { period } = await params;
  const items = await getItems<RaceItemType>("race", { period });
  return <RaceTemplate items={items} />;
}
