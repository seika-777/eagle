import PeriodListTemplate from "@/component/templates/PeriodListTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
import { getRegulationItems } from "@/const/function/getRegulationItems";

export const dynamic = "force-static";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.PERIOD_LIST,
  description: METADATA.DESCRIPTION.PERIOD_LIST,
};

export default async function Period() {
  const items = await getRegulationItems("list");
  return <PeriodListTemplate items={items} />;
}
