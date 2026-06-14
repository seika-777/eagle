import { supabase } from "@/lib/supabase";
import type { LatestScheduledRegulationType } from "@/const/type/mypage/LatestScheduledRegulationType";
import type { LevelCapScheduleType } from "@/const/type/regulation/LevelCapScheduleType";

// level_cap_schedule が空配列でない（日程登録あり）レギュレーションのうち
// id 最大を最新として返す（設計「最新レギュレーション判定」準拠）。
// publish_type = "public" 条件は既存 getRegulationItems に倣う。
// 該当なしは null を返す。
export const getLatestScheduledRegulation =
  async (): Promise<LatestScheduledRegulationType | null> => {
    const { data, error } = await supabase
      .from("regulation_items")
      .select("id, name, level_cap_belt, level_cap_schedule")
      .eq("publish_type", "public")
      .order("id", { ascending: false });
    if (error) throw error;

    for (const row of data ?? []) {
      // jsonb は any/unknown を使わずランタイムチェックしてマッピングする。
      if (!Array.isArray(row.level_cap_schedule) || row.level_cap_schedule.length === 0) {
        continue;
      }

      const levelCapSchedule: LevelCapScheduleType[] = (
        row.level_cap_schedule as Record<string, string | number | boolean | null>[]
      ).map((item) => ({
        levelCapId: Number(item.levelCapId),
        level: String(item.level),
        date: String(item.date),
      }));

      // id 降順で取得済みのため、最初に見つかったものが最新（id 最大）。
      return {
        id: row.id,
        name: row.name,
        levelCapBelt: row.level_cap_belt,
        levelCapSchedule,
      };
    }

    return null;
  };
