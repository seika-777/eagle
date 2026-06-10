"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import StageTermList from "@/component/organisms/stageTerm/StageTermList";
import { STYLE } from "@/const/common/STYLE";
import type { StageTermItemType } from "@/const/type/stageTerm/StageTermItemType";

type Props = {
  items: StageTermItemType[];
};

export default function StageTermTemplate({ items }: Props) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <StageTermList items={items} />
      </Box>
    </>
  );
}
