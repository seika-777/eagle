import HouseRuleTemplate from "@/component/templates/HouseRuleTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.HOUSE_RULE,
  description: METADATA.DESCRIPTION.HOUSE_RULE,
};

export default function HouseRule() {
  return <HouseRuleTemplate />;
}
