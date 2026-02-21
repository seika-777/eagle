import Papa from "papaparse";
import type { RuleType } from "@/const/type/common/RuleType";
import type { HouseRuleItemType } from "@/const/type/houseRule/HouseRuleItemType";

type HouseRuleCsvRow = {
  id: string;
  ruleType: string;
  supplementId: string;
  about: string;
  description: string;
};

export const parseHouseRuleItems = (
  csvText: string,
): HouseRuleItemType[] => {
  const result = Papa.parse<HouseRuleCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data
    .filter((row) => row.id && row.ruleType)
    .map((row) => ({
      id: Number(row.id),
      ruleType: row.ruleType as RuleType,
      supplementId: row.supplementId ? Number(row.supplementId) : null,
      about: row.about ?? "",
      description: row.description ?? "",
    }));
};
