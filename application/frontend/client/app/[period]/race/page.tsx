import RaceTemplate from "@/component/templates/RaceTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.RACE,
  description: METADATA.DESCRIPTION.RACE,
};

export default async function Race({
  params,
}: {
  params: Promise<{ period: string }>;
}) {
  const { period } = await params;
  return <RaceTemplate period={period} />;
}
