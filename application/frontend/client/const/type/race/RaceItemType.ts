import type { RaceType } from "@/const/type/race/RaceType";

export type RaceItemType = {
  id: number;
  name: string;
  raceType: RaceType[];
  url: string;
  isOriginal: boolean;
  regulationPeriod: string;
};
