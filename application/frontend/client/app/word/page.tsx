import WordTemplate from "@/component/templates/WordTemplate";
import { getItems } from "@/const/function/getItems";
import { getPageMetadata } from "@/const/function/getPageMetadata";
import type { WordItemType } from "@/const/type/word/WordItemType";

export const dynamic = "force-static";
export async function generateMetadata() {
  return await getPageMetadata("WORD");
}

export default async function Word() {
  const items = await getItems<WordItemType>("word");
  return <WordTemplate items={items} />;
}
