export type ItemRegulationItemType = "race" | "god" | "school" | "supplement" | "stage-term";

export type ItemRegulationType = {
  itemType: ItemRegulationItemType;
  itemId: number;
  regulationId: number;
};
