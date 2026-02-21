import GodTemplate from "@/component/templates/GodTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.GOD,
  description: METADATA.DESCRIPTION.GOD,
};

export default async function God({
  params,
}: {
  params: Promise<{ period: string }>;
}) {
  const { period } = await params;
  return <GodTemplate period={period} />;
}
