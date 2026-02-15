export type RegulationItemType = {
  regulation: {
    id: number;
    name: string;
    description: string;
    recruitment: string;
    stage: string;
    race: string;
    supplement: string;
    notes: string;
    levelCapBelt: string;
  };
  race: {
    id: number;
    name: string;
    raceType: string;
  }[];
  supplement: {
    id: number;
    name: string;
  };
};
