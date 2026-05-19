import type { RuleType } from "@/const/type/common/RuleType";

export type HouseRuleItemType = {
  id: number;
  ruleType: RuleType;
  supplementId: number | null;
  about: string;
  description: string;
};
