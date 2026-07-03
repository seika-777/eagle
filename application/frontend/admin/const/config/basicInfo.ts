import { BASIC_INFO } from "@/const/pages/BASIC_INFO";
import type { BasicInfoConfigType } from "@/const/type/config/BasicInfoConfigType";
import type { GuideItemType } from "@/const/type/option/GuideItemType";

export const basicInfoConfig: BasicInfoConfigType = {
  formSections: [
    {
      title: BASIC_INFO.TEXT.SECTION_SITE_NAME,
      items: [
        { column: "siteName", label: "サイト名", type: "text", rule: { required: true } },
      ],
    },
    {
      title: BASIC_INFO.TEXT.SECTION_TOP,
      items: [
        { column: "topAboutText", label: "About 本文", type: "textarea", rule: { required: true }, rows: 4 },
        { column: "topRegulationText", label: "Regulation 本文", type: "textarea", rows: 4 },
        { column: "topContactText", label: "Contact 案内文", type: "textarea", rule: { required: true }, rows: 4 },
        { column: "topContactXUrl", label: "X アカウントURL", type: "text", rule: { required: true } },
      ],
    },
    {
      title: BASIC_INFO.TEXT.SECTION_LEVEL_CAP,
      items: [
        { column: "levelCapGuide", label: "ガイド", type: "guide-list" },
        { column: "levelCapGmRewardDescription", label: "GM報酬 説明文", type: "textarea", rows: 4 },
        { column: "levelCapProcessFootnote", label: "セッション報酬 注記", type: "textarea", rows: 4 },
      ],
    },
  ],
  initialForm: {
    siteName: "",
    topAboutText: "",
    topRegulationText: "",
    topContactText: "",
    topContactXUrl: "",
    levelCapGuide: [],
    levelCapGmRewardDescription: "",
    levelCapProcessFootnote: "",
  },
  toForm: (data) => {
    const parseGuideList = (json: string): GuideItemType[] => {
      if (!json) return [];
      try {
        const parsed: Record<string, string | number | boolean | null>[] = JSON.parse(json);
        return Array.isArray(parsed)
          ? parsed.map((item) => ({
              title: (item.title as string) ?? "",
              description: (item.description as string) ?? "",
            }))
          : [];
      } catch {
        return [];
      }
    };
    return {
      siteName: data.site_name ?? "",
      topAboutText: data.top_about_text ?? "",
      topRegulationText: data.top_regulation_text ?? "",
      topContactText: data.top_contact_text ?? "",
      topContactXUrl: data.top_contact_x_url ?? "",
      levelCapGuide: parseGuideList(data.level_cap_guide ?? ""),
      levelCapGmRewardDescription: data.level_cap_gm_reward_description ?? "",
      levelCapProcessFootnote: data.level_cap_process_footnote ?? "",
    };
  },
  toBody: (form) => ({
    site_name: String(form.siteName ?? ""),
    top_about_text: String(form.topAboutText ?? ""),
    top_regulation_text: String(form.topRegulationText ?? ""),
    top_contact_text: String(form.topContactText ?? ""),
    top_contact_x_url: String(form.topContactXUrl ?? ""),
    level_cap_guide: JSON.stringify(Array.isArray(form.levelCapGuide) ? form.levelCapGuide : []),
    level_cap_gm_reward_description: String(form.levelCapGmRewardDescription ?? ""),
    level_cap_process_footnote: String(form.levelCapProcessFootnote ?? ""),
  }),
};
