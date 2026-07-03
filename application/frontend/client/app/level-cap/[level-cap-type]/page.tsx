import { notFound } from "next/navigation";
import LevelCapTemplate from "@/component/templates/LevelCapTemplate";
import { getLevelCapItems } from "@/const/function/getLevelCapItems";
import { getOptions } from "@/const/function/getOptions";
import { getPageMetadata } from "@/const/function/getPageMetadata";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [{ "level-cap-type": "B" }, { "level-cap-type": "C" }];
}

export async function generateMetadata({ params }: { params: Promise<{ "level-cap-type": string }> }) {
  const { "level-cap-type": beltType } = await params;
  return getPageMetadata("LEVEL_CAP", beltType);
}

type Props = {
  params: Promise<{ "level-cap-type": string }>;
};

export default async function LevelCapPage({ params }: Props) {
  const { "level-cap-type": beltType } = await params;
  if (beltType !== "B" && beltType !== "C") notFound();
  const items = await getLevelCapItems(beltType);
  const options = await getOptions();
  return (
    <LevelCapTemplate
      items={items}
      beltType={beltType}
      guide={options.levelCapGuide}
      gmRewardDescription={options.levelCapGmRewardDescription}
      processFootnote={options.levelCapProcessFootnote}
    />
  );
}
