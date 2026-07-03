import { supabase } from "@/lib/supabase";
import { COMMON } from "@/const/common/COMMON";
import { PATH } from "@/const/common/PATH";
import { TOP_PAGE } from "@/const/pages/TOP_PAGE";
import { LEVEL_CAP_PAGE } from "@/const/pages/LEVEL_CAP_PAGE";
import type { SiteOptionsType } from "@/const/type/option/SiteOptionsType";

type OptionRow = { key: string; value: string | null };

const OPTION_KEYS = [
  "site_name",
  "top_about_text",
  "top_regulation_text",
  "top_contact_text",
  "top_contact_x_url",
  "level_cap_guide",
  "level_cap_gm_reward_description",
  "level_cap_process_footnote",
];

const FALLBACK: SiteOptionsType = {
  siteName: COMMON.SITE_NAME,
  topAboutText: TOP_PAGE.TEXT.aboutText,
  topRegulationText: TOP_PAGE.TEXT.regulationText,
  topContactText: TOP_PAGE.TEXT.contactText,
  topContactXUrl: PATH.LINK.TWITTER,
  levelCapGuide: LEVEL_CAP_PAGE.GUIDE,
  levelCapGmRewardDescription: LEVEL_CAP_PAGE.TEXT.gmRewardDescription,
  levelCapProcessFootnote: LEVEL_CAP_PAGE.TEXT.processFootnote,
};

const parseJsonList = <T>(
  value: string,
  mapItem: (item: Record<string, string>) => T,
  fallback: T[]
): T[] => {
  if (!value) return fallback;
  try {
    const parsed: Record<string, string>[] = JSON.parse(value);
    if (!Array.isArray(parsed)) return fallback;
    return parsed.map(mapItem);
  } catch {
    return fallback;
  }
};

export const getOptions = async (): Promise<SiteOptionsType> => {
  try {
    const { data, error } = await supabase
      .from("options")
      .select("key, value")
      .in("key", OPTION_KEYS)
      .returns<OptionRow[]>();
    if (error || !data) return FALLBACK;

    const optionMap: Record<string, string> = {};
    data.forEach((row) => {
      optionMap[row.key] = row.value ?? "";
    });

    return {
      siteName: optionMap.site_name || FALLBACK.siteName,
      topAboutText: optionMap.top_about_text || FALLBACK.topAboutText,
      topRegulationText: optionMap.top_regulation_text || FALLBACK.topRegulationText,
      topContactText: optionMap.top_contact_text || FALLBACK.topContactText,
      topContactXUrl: optionMap.top_contact_x_url || FALLBACK.topContactXUrl,
      levelCapGuide: parseJsonList(
        optionMap.level_cap_guide ?? "",
        (item) => ({
          title: item.title ?? "",
          description: item.description ?? "",
        }),
        FALLBACK.levelCapGuide
      ),
      levelCapGmRewardDescription:
        optionMap.level_cap_gm_reward_description || FALLBACK.levelCapGmRewardDescription,
      levelCapProcessFootnote:
        optionMap.level_cap_process_footnote || FALLBACK.levelCapProcessFootnote,
    };
  } catch {
    return FALLBACK;
  }
};
