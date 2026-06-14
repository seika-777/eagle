import type { LevelCapScheduleType } from "@/const/type/regulation/LevelCapScheduleType";

// 最新（level_cap_schedule 非空・id 最大）レギュレーションの
// 成長指示に必要な最小情報。
export type LatestScheduledRegulationType = {
  id: number;
  name: string;
  levelCapBelt: string;
  levelCapSchedule: LevelCapScheduleType[];
};
