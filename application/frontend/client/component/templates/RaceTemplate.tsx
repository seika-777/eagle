"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import RaceList from "@/component/organisms/race/RaceList";
import { STYLE } from "@/const/common/STYLE";
import type { RaceItemType } from "@/const/type/race/RaceItemType";

type Props = {
  items: RaceItemType[];
};

export default function RaceTemplate({ items }: Props) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <RaceList items={items} />
      </Box>
    </>
  );
}
