import { LEVEL_CAP_EDIT } from "@/const/pages/LEVEL_CAP_EDIT";
import type { LevelCapConfigType } from "@/const/type/config/LevelCapConfigType";

export const levelCapConfig: LevelCapConfigType = {
  formSections: [
    {
      title: LEVEL_CAP_EDIT.TEXT.SECTION_PROCESS,
      fields: [
        { column: "minExp", label: LEVEL_CAP_EDIT.TEXT.LABEL_MIN_EXP, valueType: "requiredInt" },
        { column: "expDiff", label: LEVEL_CAP_EDIT.TEXT.LABEL_EXP_DIFF, valueType: "nullableInt" },
        { column: "minGrowth", label: LEVEL_CAP_EDIT.TEXT.LABEL_MIN_GROWTH, valueType: "nullableInt" },
        { column: "minReward", label: LEVEL_CAP_EDIT.TEXT.LABEL_MIN_REWARD, valueType: "requiredInt" },
        { column: "minHonor", label: LEVEL_CAP_EDIT.TEXT.LABEL_MIN_HONOR, valueType: "nullableInt" },
        { column: "maxAdventurerRank", label: LEVEL_CAP_EDIT.TEXT.LABEL_MAX_ADVENTURER_RANK, valueType: "text" },
      ],
      footnote: LEVEL_CAP_EDIT.TEXT.NOTE_EXP_DIFF,
    },
    {
      title: LEVEL_CAP_EDIT.TEXT.SECTION_GM_REWARD,
      fields: [
        { column: "rewardAmount", label: LEVEL_CAP_EDIT.TEXT.LABEL_REWARD_AMOUNT, valueType: "requiredInt" },
        { column: "offBalanceReward", label: LEVEL_CAP_EDIT.TEXT.LABEL_OFF_BALANCE_REWARD, valueType: "requiredInt" },
        { column: "honor", label: LEVEL_CAP_EDIT.TEXT.LABEL_HONOR, valueType: "requiredInt" },
      ],
    },
    {
      title: LEVEL_CAP_EDIT.TEXT.SECTION_SESSION_REWARD,
      fields: [
        { column: "distribution", label: LEVEL_CAP_EDIT.TEXT.LABEL_DISTRIBUTION, valueType: "nullableInt" },
        { column: "rewardPerSession", label: LEVEL_CAP_EDIT.TEXT.LABEL_REWARD_PER_SESSION, valueType: "text" },
        { column: "swordFragments", label: LEVEL_CAP_EDIT.TEXT.LABEL_SWORD_FRAGMENTS, valueType: "text" },
        { column: "growthCount", label: LEVEL_CAP_EDIT.TEXT.LABEL_GROWTH_COUNT, valueType: "requiredInt" },
        { column: "growthLimit", label: LEVEL_CAP_EDIT.TEXT.LABEL_GROWTH_LIMIT, valueType: "requiredInt" },
        { column: "fCountLimit", label: LEVEL_CAP_EDIT.TEXT.LABEL_F_COUNT_LIMIT, valueType: "requiredInt" },
        { column: "rewardLimit", label: LEVEL_CAP_EDIT.TEXT.LABEL_REWARD_LIMIT, valueType: "requiredInt" },
        { column: "excessGrowth", label: LEVEL_CAP_EDIT.TEXT.LABEL_EXCESS_GROWTH, valueType: "text" },
      ],
    },
  ],
  int4Max: 2147483647,
  parseInteger: (text) => (/^-?\d+$/.test(text.trim()) ? Number(text.trim()) : null),
  toForm: (rows) =>
    rows.map((row) => ({
      id: row.id,
      level: row.level,
      values: {
        minExp: String(row.min_exp),
        expDiff: row.exp_diff !== null ? String(row.exp_diff) : "",
        minGrowth: row.min_growth !== null ? String(row.min_growth) : "",
        minReward: String(row.min_reward),
        minHonor: row.min_honor !== null ? String(row.min_honor) : "",
        maxAdventurerRank: row.max_adventurer_rank,
        rewardAmount: String(row.reward_amount),
        offBalanceReward: String(row.off_balance_reward),
        honor: String(row.honor),
        distribution: row.distribution !== null ? String(row.distribution) : "",
        rewardPerSession: row.reward_per_session,
        swordFragments: row.sword_fragments,
        growthCount: String(row.growth_count),
        growthLimit: String(row.growth_limit),
        fCountLimit: String(row.f_count_limit),
        rewardLimit: String(row.reward_limit),
        excessGrowth: row.excess_growth,
      },
    })),
  toBody: (rows) => ({
    items: rows.map((row) => ({
      id: row.id,
      min_exp: Number(row.values.minExp?.trim()),
      min_growth: row.values.minGrowth?.trim() ? Number(row.values.minGrowth.trim()) : null,
      min_reward: Number(row.values.minReward?.trim()),
      min_honor: row.values.minHonor?.trim() ? Number(row.values.minHonor.trim()) : null,
      exp_diff: row.values.expDiff?.trim() ? Number(row.values.expDiff.trim()) : null,
      max_adventurer_rank: (row.values.maxAdventurerRank ?? "").trim(),
      reward_amount: Number(row.values.rewardAmount?.trim()),
      off_balance_reward: Number(row.values.offBalanceReward?.trim()),
      honor: Number(row.values.honor?.trim()),
      distribution: row.values.distribution?.trim() ? Number(row.values.distribution.trim()) : null,
      reward_per_session: (row.values.rewardPerSession ?? "").trim(),
      sword_fragments: (row.values.swordFragments ?? "").trim(),
      growth_count: Number(row.values.growthCount?.trim()),
      growth_limit: Number(row.values.growthLimit?.trim()),
      f_count_limit: Number(row.values.fCountLimit?.trim()),
      reward_limit: Number(row.values.rewardLimit?.trim()),
      excess_growth: (row.values.excessGrowth ?? "").trim(),
    })),
  }),
};
