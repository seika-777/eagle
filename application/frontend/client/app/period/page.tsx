import PeriodListTemplate from "@/component/templates/PeriodListTemplate";
import { getPageMetadata } from "@/const/function/getPageMetadata";
import { getRegulationItems } from "@/const/function/getRegulationItems";

export const dynamic = "force-static";

export async function generateMetadata() {
  return await getPageMetadata("PERIOD_LIST");
}

export default async function Period() {
  const items = await getRegulationItems("list");
  return <PeriodListTemplate items={items} />;
}
