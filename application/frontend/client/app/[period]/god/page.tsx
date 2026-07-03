import GodTemplate from "@/component/templates/GodTemplate";
import { getItems } from "@/const/function/getItems";
import { getPageMetadata } from "@/const/function/getPageMetadata";
import { getRegulationItems } from "@/const/function/getRegulationItems";
import type { GodItemType } from "@/const/type/god/GodItemType";

export const dynamic = "force-static";
export async function generateMetadata() {
  return await getPageMetadata("GOD");
}

export async function generateStaticParams() {
  const items = await getRegulationItems("list");
  return items.map((item) => ({ period: String(item.id) }));
}

type Props = {
  params: Promise<{ period: string }>;
};

export default async function God({ params }: Props) {
  const { period } = await params;
  const items = await getItems<GodItemType>("god", { period });
  return <GodTemplate items={items} />;
}
