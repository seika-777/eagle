import ProhibitionTemplate from "@/component/templates/ProhibitionTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
import { getItems } from "@/const/function/getItems";
import type { ProhibitionItemType } from "@/const/type/houseRule/ProhibitionItemType";

export const dynamic = "force-static";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.PROHIBITION,
  description: METADATA.DESCRIPTION.PROHIBITION,
};

export default async function Prohibition() {
  const items = await getItems<ProhibitionItemType>("prohibition");
  return <ProhibitionTemplate items={items} />;
}
