"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import SupplementList from "@/component/organisms/supplement/SupplementList";
import { STYLE } from "@/const/common/STYLE";
import type { SupplementItemType } from "@/const/type/supplement/SupplementItemType";

type Props = {
  items: SupplementItemType[];
};

export default function SupplementTemplate({ items }: Props) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <SupplementList items={items} />
      </Box>
    </>
  );
}
