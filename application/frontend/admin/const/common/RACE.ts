import type { RaceListType } from "@/const/type/race/RaceListType";

export const RACE: {
  TEXT: { [key in RaceListType]: string };
  VALUE: { [key: string]: string };
} = {
  TEXT: {
    human: "人族",
    barbaros: "蛮族",
    demon: "魔神",
    maginery: "魔動機",
    mysthicalBeast: "幻獣",
  },
  VALUE: {
    HUMAN: "human",
    BARBAROS: "barbaros",
    DEMON: "demon",
    MAGINERY: "maginery",
    MYSTHICAL_BEAST: "mysthicalBeast",
  },
} as const;
