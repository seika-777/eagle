import HomeTemplate from "@/component/templates/HomeTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
import { getRegulationItems } from "@/const/function/getRegulationItems";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME,
  description: METADATA.DESCRIPTION.HOME,
};

export default async function Home() {
  const latestRegulation = await getRegulationItems("latest");
  return <HomeTemplate latestRegulation={latestRegulation} />;
}
