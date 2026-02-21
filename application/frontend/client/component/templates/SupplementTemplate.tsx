"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import SupplementList from "@/component/organisms/supplement/SupplementList";
import { STYLE } from "@/const/common/STYLE";

export default function SupplementTemplate({ period }: { period?: string }) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <SupplementList period={period} />
      </Box>
    </>
  );
}
