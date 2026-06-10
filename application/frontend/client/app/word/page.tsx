import WordTemplate from "@/component/templates/WordTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
import { getItems } from "@/const/function/getItems";
import type { WordItemType } from "@/const/type/word/WordItemType";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.WORD,
  description: METADATA.DESCRIPTION.WORD,
};

export default async function Word() {
  const items = await getItems<WordItemType>("word");
  return <WordTemplate items={items} />;
}
