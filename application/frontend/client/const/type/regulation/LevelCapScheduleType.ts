// regulation_items.level_cap_schedule（jsonb）の1要素。
// 形: [{ levelCapId: number, level: string, date: "YYYY-MM-DD" }]
export type LevelCapScheduleType = {
  levelCapId: number;
  level: string;
  date: string;
};
