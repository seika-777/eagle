import GodTemplate from "@/component/templates/GodTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
import { getItems } from "@/const/function/getItems";
import { getRegulationItems } from "@/const/function/getRegulationItems";
import type { GodItemType } from "@/const/type/god/GodItemType";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.GOD,
  description: METADATA.DESCRIPTION.GOD,
};

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
