import { notFound } from "next/navigation";
import LevelCapTemplate from "@/component/templates/LevelCapTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
import { getLevelCapItems } from "@/const/function/getLevelCapItems";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [{ "level-cap-type": "B" }, { "level-cap-type": "C" }];
}

export async function generateMetadata({ params }: { params: Promise<{ "level-cap-type": string }> }) {
  const { "level-cap-type": beltType } = await params;
  return {
    title: COMMON.SITE_NAME + "|" + METADATA.TITLE.LEVEL_CAP + beltType,
    description: METADATA.DESCRIPTION.LEVEL_CAP,
  };
}

type Props = {
  params: Promise<{ "level-cap-type": string }>;
};

export default async function LevelCapPage({ params }: Props) {
  const { "level-cap-type": beltType } = await params;
  if (beltType !== "B" && beltType !== "C") notFound();
  const items = await getLevelCapItems(beltType);
  return <LevelCapTemplate items={items} beltType={beltType} />;
}
