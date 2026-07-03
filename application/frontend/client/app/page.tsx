import HomeTemplate from "@/component/templates/HomeTemplate";
import { METADATA } from "@/const/common/METADATA";
import { getOptions } from "@/const/function/getOptions";
import { getRegulationItems } from "@/const/function/getRegulationItems";

export const dynamic = "force-static";

export async function generateMetadata() {
  const options = await getOptions();
  return {
    title: options.siteName,
    description: METADATA(options.siteName).DESCRIPTION.HOME,
  };
}

export default async function Home() {
  const latestRegulation = await getRegulationItems("latest");
  const options = await getOptions();
  return <HomeTemplate latestRegulation={latestRegulation} options={options} />;
}
