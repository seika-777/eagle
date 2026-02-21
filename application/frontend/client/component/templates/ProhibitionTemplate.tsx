"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import ProhibitionList from "@/component/organisms/houseRule/ProhibitionList";
import { STYLE } from "@/const/common/STYLE";

export default function ProhibitionTemplate() {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <ProhibitionList />
      </Box>
    </>
  );
}
