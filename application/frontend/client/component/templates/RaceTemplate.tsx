"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import RaceList from "@/component/organisms/race/RaceList";
import { STYLE } from "@/const/common/STYLE";

export default function RaceTemplate({ period }: { period?: string }) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <RaceList period={period} />
      </Box>
    </>
  );
}
