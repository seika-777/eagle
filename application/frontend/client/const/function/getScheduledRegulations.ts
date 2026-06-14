import { supabase } from "@/lib/supabase";
import type { LatestScheduledRegulationType } from "@/const/type/mypage/LatestScheduledRegulationType";
import type { LevelCapScheduleType } from "@/const/type/regulation/LevelCapScheduleType";

// level_cap_schedule が空配列でない（日程登録あり）レギュレーションを全件、id 降順で返す。
// getLatestScheduledRegulation と同じ取得・jsonb マッピング方式を踏襲する
// （フォームで一覧表示するため「最新のものまで」= schedule ありの全件）。
// publish_type = "public" 条件は既存 getRegulationItems / getLatestScheduledRegulation に倣う。
export const getScheduledRegulations =
  async (): Promise<LatestScheduledRegulationType[]> => {
    const { data, error } = await supabase
      .from("regulation_items")
      .select("id, name, level_cap_belt, level_cap_schedule")
      .eq("publish_type", "public")
      .order("id", { ascending: false });
    if (error) throw error;

    const result: LatestScheduledRegulationType[] = [];

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

      result.push({
        id: row.id,
        name: row.name,
        levelCapBelt: row.level_cap_belt,
        levelCapSchedule,
      });
    }

    return result;
  };
