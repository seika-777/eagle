import SchoolTemplate from "@/component/templates/SchoolTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
import { getItems } from "@/const/function/getItems";
import { getRegulationItems } from "@/const/function/getRegulationItems";
import type { SchoolItemType } from "@/const/type/school/SchoolItemType";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.SCHOOL,
  description: METADATA.DESCRIPTION.SCHOOL,
};

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
