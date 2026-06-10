import HouseRuleTemplate from "@/component/templates/HouseRuleTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
import { getItems } from "@/const/function/getItems";
import type { HouseRuleItemType } from "@/const/type/houseRule/HouseRuleItemType";

export const dynamic = "force-static";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.HOUSE_RULE,
  description: METADATA.DESCRIPTION.HOUSE_RULE,
};

export default async function HouseRule() {
  const items = await getItems<HouseRuleItemType>("house-rule");
  return <HouseRuleTemplate items={items} />;
}
