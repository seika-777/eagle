import SupplementTemplate from "@/component/templates/SupplementTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
import { getItems } from "@/const/function/getItems";
import { getRegulationItems } from "@/const/function/getRegulationItems";
import type { SupplementItemType } from "@/const/type/supplement/SupplementItemType";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.SUPPLEMENT,
  description: METADATA.DESCRIPTION.SUPPLEMENT,
};

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
