import StageTermTemplate from "@/component/templates/StageTermTemplate";
import { getItems } from "@/const/function/getItems";
import { getPageMetadata } from "@/const/function/getPageMetadata";
import type { StageTermItemType } from "@/const/type/stageTerm/StageTermItemType";

export const dynamic = "force-static";
export async function generateMetadata() {
  return await getPageMetadata("STAGE_TERM");
}

export default async function StageTerm() {
  const items = await getItems<StageTermItemType>("stage-term");
  return <StageTermTemplate items={items} />;
}
