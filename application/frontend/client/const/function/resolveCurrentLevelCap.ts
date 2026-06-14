import { getLevelCapItems } from "@/const/function/getLevelCapItems";
import type { LevelCapItemType } from "@/const/type/levelCap/LevelCapType";
import type { LevelCapScheduleType } from "@/const/type/regulation/LevelCapScheduleType";

// 今日（または基準日）が level_cap_schedule のどの level 区間に属するかを判定し、
// その belt_type + level の level_cap 行を取得する（設計「現在のレベルキャップ解決」準拠）。
//
// - schedule を date 昇順ソートし「date <= 基準日」を満たす最後の要素を現在区間とする。
// - 該当なし（最初の日程より前 = レベルキャップ未開始）は null を返す。
// - 決まった level と beltType で level_cap 行を取得（なければ null）。
//
// baseDate は "YYYY-MM-DD" 文字列。省略時は今日（ローカル日付）。
export const resolveCurrentLevelCap = async (
  levelCapSchedule: LevelCapScheduleType[],
  beltType: string,
  baseDate?: string
): Promise<LevelCapItemType | null> => {
  const today = baseDate ?? formatToday();

  // 1. date 昇順にソート（元配列を破壊しないようコピー）。
  const sorted = [...levelCapSchedule].sort((a, b) => (a.date <= b.date ? -1 : 1));

  // 2. 「date <= today」を満たす最後の要素を現在区間とする。
  let current: LevelCapScheduleType | null = null;
  for (const entry of sorted) {
    if (entry.date <= today) {
      current = entry;
    } else {
      // ソート済みなので以降はすべて未来。
      break;
    }
  }

  // 3. 最初の日程より前（レベルキャップ未開始）は成長指示なし。
  if (current === null) return null;

  // 4. belt_type + level で level_cap 行を一意に特定（UNIQUE(belt_type, level)）。
  const items = await getLevelCapItems(beltType);
  const matched = items.find((item) => item.level === current.level);

  return matched ?? null;
};

const formatToday = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
