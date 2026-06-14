export type GrowthGuideKind = "exp" | "growth" | "reward" | "honor";

export type GrowthGuideItemType = {
  kind: GrowthGuideKind;
  value: number;
};

export type GrowthGuideType = {
  characterName: string;
  sheetUrl: string;
  items: GrowthGuideItemType[]; // 条件を満たした指示のみ
};

// calcGrowthGuide の入力（ゆとシート値 + level_cap しきい値）
// expDiff / minGrowth / minHonor は nullable（null は評価しない）。
export type GrowthGuideInput = {
  expTotal: number;
  historyGrowTotal: number;
  historyMoneyTotal: number;
  historyHonorTotal: number;
  minExp: number;
  minGrowth: number | null;
  minReward: number;
  minHonor: number | null;
  expDiff: number | null;
};
