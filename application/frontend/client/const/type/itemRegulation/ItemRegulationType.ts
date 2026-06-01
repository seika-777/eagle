export type ItemRegulationItemType = "race" | "god" | "school" | "supplement";

export type ItemRegulationType = {
  itemType: ItemRegulationItemType;
  itemId: number;
  regulationId: number;
};
