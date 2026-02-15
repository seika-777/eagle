import RaceTemplate from "@/component/templates/RaceTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.RACE,
  description: "Home page of the application",
};

export default async function Race({
  params,
}: {
  params: Promise<{ period: string }>;
}) {
  const { period } = await params;
  return <RaceTemplate period={period} />;
}
