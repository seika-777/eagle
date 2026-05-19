"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import PeriodList from "@/component/organisms/period/PeriodList";
import { STYLE } from "@/const/common/STYLE";

export default function PeriodListTemplate() {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <PeriodList />
      </Box>
    </>
  );
}
