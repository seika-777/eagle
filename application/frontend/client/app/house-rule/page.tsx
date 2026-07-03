import HouseRuleTemplate from "@/component/templates/HouseRuleTemplate";
import { getItems } from "@/const/function/getItems";
import { getPageMetadata } from "@/const/function/getPageMetadata";
import type { HouseRuleItemType } from "@/const/type/houseRule/HouseRuleItemType";

export const dynamic = "force-static";

export async function generateMetadata() {
  return await getPageMetadata("HOUSE_RULE");
}

export default async function HouseRule() {
  const items = await getItems<HouseRuleItemType>("house-rule");
  return <HouseRuleTemplate items={items} />;
}
