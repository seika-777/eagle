"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import OriginalList from "@/component/organisms/original/OriginalList";
import { STYLE } from "@/const/common/STYLE";
import type { RaceItemType } from "@/const/type/race/RaceItemType";
import type { GodItemType } from "@/const/type/god/GodItemType";
import type { SchoolItemType } from "@/const/type/school/SchoolItemType";
import type { OriginalItemType } from "@/const/type/original/OriginalItemType";

type Props = {
  raceItems: RaceItemType[];
  godItems: GodItemType[];
  schoolItems: SchoolItemType[];
  originalItems: OriginalItemType[];
};

export default function OriginalTemplate({ raceItems, godItems, schoolItems, originalItems }: Props) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <OriginalList
          raceItems={raceItems}
          godItems={godItems}
          schoolItems={schoolItems}
          originalItems={originalItems}
        />
      </Box>
    </>
  );
}
