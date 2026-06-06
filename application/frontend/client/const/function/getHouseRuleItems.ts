import { supabase } from "@/lib/supabase";
import type { HouseRuleItemType } from "@/const/type/houseRule/HouseRuleItemType";
import type { RuleType } from "@/const/type/common/RuleType";

export const getHouseRuleItems = async (): Promise<HouseRuleItemType[]> => {
  const { data, error } = await supabase
    .from("house_rule_items")
    .select("id, rule_type, supplement_id, about, description")
    .order("id", { ascending: true });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    ruleType: row.rule_type as RuleType,
    supplementId: row.supplement_id,
    about: row.about,
    description: row.description,
  }));
};
