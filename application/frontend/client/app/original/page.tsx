import OriginalTemplate from "@/component/templates/OriginalTemplate";
import { getItems } from "@/const/function/getItems";
import { getPageMetadata } from "@/const/function/getPageMetadata";
import type { RaceItemType } from "@/const/type/race/RaceItemType";
import type { GodItemType } from "@/const/type/god/GodItemType";
import type { SchoolItemType } from "@/const/type/school/SchoolItemType";
import type { OriginalItemType } from "@/const/type/original/OriginalItemType";

export const dynamic = "force-static";

export async function generateMetadata() {
  return await getPageMetadata("ORIGINAL");
}

export default async function Original() {
  const [raceItems, godItems, schoolItems, originalItems] = await Promise.all([
    getItems<RaceItemType>("race"),
    getItems<GodItemType>("god"),
    getItems<SchoolItemType>("school"),
    getItems<OriginalItemType>("original"),
  ]);
  return (
    <OriginalTemplate
      raceItems={raceItems}
      godItems={godItems}
      schoolItems={schoolItems}
      originalItems={originalItems}
    />
  );
}
