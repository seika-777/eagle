import type { EntityConfigType } from "@/const/type/config/EntityConfigType";
import { regulationConfig } from "@/const/config/regulation";
import { godConfig } from "@/const/config/god";
import { schoolConfig } from "@/const/config/school";
import { raceConfig } from "@/const/config/race";
import { houseRuleConfig } from "@/const/config/houseRule";
import { supplementConfig } from "@/const/config/supplement";
import { originalConfig } from "@/const/config/original";
import { wordConfig } from "@/const/config/word";
import { stageTermConfig } from "@/const/config/stageTerm";
import { userRoleConfig } from "@/const/config/userRole";

export const configMap: Record<string, EntityConfigType> = {
  regulation: regulationConfig,
  god: godConfig,
  school: schoolConfig,
  race: raceConfig,
  "house-rule": houseRuleConfig,
  supplement: supplementConfig,
  original: originalConfig,
  word: wordConfig,
  "stage-term": stageTermConfig,
  "user-role": userRoleConfig,
};
