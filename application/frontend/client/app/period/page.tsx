import PeriodListTemplate from "@/component/templates/PeriodListTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.PERIOD_LIST,
  description: METADATA.DESCRIPTION.PERIOD_LIST,
};

export default function Period() {
  return <PeriodListTemplate />;
}
