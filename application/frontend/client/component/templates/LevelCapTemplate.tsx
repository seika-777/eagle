"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import LevelCapContent from "@/component/organisms/levelCap/LevelCapContent";
import { STYLE } from "@/const/common/STYLE";
import type { LevelCapGuideSection } from "@/const/type/levelCap/LevelCapGuideSectionType";
import type { LevelCapItemType } from "@/const/type/levelCap/LevelCapType";

type Props = {
  items: LevelCapItemType[];
  beltType: string;
  guide: LevelCapGuideSection[];
  gmRewardDescription: string;
  processFootnote: string;
};

export default function LevelCapTemplate({ items, beltType, guide, gmRewardDescription, processFootnote }: Props) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <LevelCapContent
          items={items}
          beltType={beltType}
          guide={guide}
          gmRewardDescription={gmRewardDescription}
          processFootnote={processFootnote}
        />
      </Box>
    </>
  );
}
