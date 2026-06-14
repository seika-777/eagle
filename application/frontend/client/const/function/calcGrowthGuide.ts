import type {
  GrowthGuideInput,
  GrowthGuideItemType,
} from "@/const/type/mypage/GrowthGuideType";

// 成長指示の計算（純粋関数・DB アクセスなし）。
// ゆとシート値と level_cap しきい値を比較し、条件を満たす指示のみ push する。
// nullable（expDiff / minGrowth / minHonor）が null の条件は評価しない（指示を出さない）。
export const calcGrowthGuide = (input: GrowthGuideInput): GrowthGuideItemType[] => {
  const items: GrowthGuideItemType[] = [];

  // exp: 経験点だけ差分は exp_diff 固定。先頭レベル（expDiff が null）は出さない。
  if (input.expDiff !== null && input.expTotal < input.minExp) {
    items.push({ kind: "exp", value: input.expDiff });
  }

  // growth: しきい値 − 現在値。minGrowth が null なら評価しない。
  if (input.minGrowth !== null && input.historyGrowTotal < input.minGrowth) {
    items.push({ kind: "growth", value: input.minGrowth - input.historyGrowTotal });
  }

  // reward: しきい値 − 現在値。minReward は非 null。
  if (input.historyMoneyTotal < input.minReward) {
    items.push({ kind: "reward", value: input.minReward - input.historyMoneyTotal });
  }

  // honor: しきい値 − 現在値。minHonor が null なら評価しない。
  if (input.minHonor !== null && input.historyHonorTotal < input.minHonor) {
    items.push({ kind: "honor", value: input.minHonor - input.historyHonorTotal });
  }

  return items;
};
