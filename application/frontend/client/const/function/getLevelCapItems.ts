import { supabase } from "@/lib/supabase";
import type { LevelCapItemType } from "@/const/type/levelCap/LevelCapType";

export const getLevelCapItems = async (beltType: string): Promise<LevelCapItemType[]> => {
  const { data, error } = await supabase
    .from("level_cap")
    .select("*")
    .eq("belt_type", beltType)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    beltType: row.belt_type,
    level: row.level,
    sortOrder: row.sort_order,
    minExp: Number(row.min_exp),
    minGrowth: row.min_growth !== null ? Number(row.min_growth) : null,
    minReward: Number(row.min_reward),
    minHonor: row.min_honor !== null ? Number(row.min_honor) : null,
    maxAdventurerRank: row.max_adventurer_rank,
    rewardAmount: Number(row.reward_amount),
    offBalanceReward: Number(row.off_balance_reward),
    honor: Number(row.honor),
    distribution: row.distribution !== null ? Number(row.distribution) : null,
    rewardPerSession: row.reward_per_session,
    swordFragments: row.sword_fragments,
    growthCount: Number(row.growth_count),
    growthLimit: Number(row.growth_limit),
    fCountLimit: Number(row.f_count_limit),
    rewardLimit: Number(row.reward_limit),
    excessGrowth: row.excess_growth,
  }));
};
