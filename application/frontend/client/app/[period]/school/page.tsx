import SchoolTemplate from "@/component/templates/SchoolTemplate";
import { getItems } from "@/const/function/getItems";
import { getPageMetadata } from "@/const/function/getPageMetadata";
import { getRegulationItems } from "@/const/function/getRegulationItems";
import type { SchoolItemType } from "@/const/type/school/SchoolItemType";

export const dynamic = "force-static";
export async function generateMetadata() {
  return await getPageMetadata("SCHOOL");
}

export async function generateStaticParams() {
  const items = await getRegulationItems("list");
  return items.map((item) => ({ period: String(item.id) }));
}

type Props = {
  params: Promise<{ period: string }>;
};

export default async function School({ params }: Props) {
  const { period } = await params;
  const items = await getItems<SchoolItemType>("school", { period });
  return <SchoolTemplate items={items} />;
}
