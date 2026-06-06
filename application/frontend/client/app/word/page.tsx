import WordTemplate from "@/component/templates/WordTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.WORD,
  description: METADATA.DESCRIPTION.WORD,
};

export default function Word() {
  return <WordTemplate />;
}
