"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import PeriodList from "@/component/organisms/period/PeriodList";
import { STYLE } from "@/const/common/STYLE";
import type { RegulationRow } from "@/const/function/getRegulationItems";

type Props = {
  items: RegulationRow[];
};

export default function PeriodListTemplate({ items }: Props) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <PeriodList items={items} />
      </Box>
    </>
  );
}
