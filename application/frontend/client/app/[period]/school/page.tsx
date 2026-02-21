import SchoolTemplate from "@/component/templates/SchoolTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.SCHOOL,
  description: METADATA.DESCRIPTION.SCHOOL,
};

export default async function School({
  params,
}: {
  params: Promise<{ period: string }>;
}) {
  const { period } = await params;
  return <SchoolTemplate period={period} />;
}
