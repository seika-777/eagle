import type { RuleType } from "@/const/type/common/RuleType";

export const RULE: {
  TEXT: Record<RuleType, string>;
  VALUE: Record<string, RuleType>;
  TYPE_ORDER: readonly RuleType[];
} = {
  TEXT: {
    common: "ルール",
    item: "アイテム",
    race: "種族",
    skill: "技能",
    battleSkill: "戦闘特技",
    school: "流派",
  },
  VALUE: {
    COMMON: "common",
    ITEM: "item",
    RACE: "race",
    SKILL: "skill",
    BATTLE_SKILL: "battleSkill",
    SCHOOL: "school",
  },
  TYPE_ORDER: [
    "common",
    "item",
    "race",
    "skill",
    "battleSkill",
    "school",
  ],
} as const;
