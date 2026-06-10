"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import ProhibitionList from "@/component/organisms/houseRule/ProhibitionList";
import { STYLE } from "@/const/common/STYLE";
import type { ProhibitionItemType } from "@/const/type/houseRule/ProhibitionItemType";

type Props = {
  items: ProhibitionItemType[];
};

export default function ProhibitionTemplate({ items }: Props) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <ProhibitionList items={items} />
      </Box>
    </>
  );
}
