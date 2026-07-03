import ProhibitionTemplate from "@/component/templates/ProhibitionTemplate";
import { getItems } from "@/const/function/getItems";
import { getPageMetadata } from "@/const/function/getPageMetadata";
import type { ProhibitionItemType } from "@/const/type/houseRule/ProhibitionItemType";

export const dynamic = "force-static";

export async function generateMetadata() {
  return await getPageMetadata("PROHIBITION");
}

export default async function Prohibition() {
  const items = await getItems<ProhibitionItemType>("prohibition");
  return <ProhibitionTemplate items={items} />;
}
