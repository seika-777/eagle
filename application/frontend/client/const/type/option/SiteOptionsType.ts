import type { LevelCapGuideSection } from "@/const/type/levelCap/LevelCapGuideSectionType";

export type SiteOptionsType = {
  siteName: string;
  topAboutText: string;
  topRegulationText: string;
  topContactText: string;
  topContactXUrl: string;
  levelCapGuide: LevelCapGuideSection[];
  levelCapGmRewardDescription: string;
  levelCapProcessFootnote: string;
};
