"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import StageTermList from "@/component/organisms/stageTerm/StageTermList";
import { STYLE } from "@/const/common/STYLE";

export default function StageTermTemplate() {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <StageTermList />
      </Box>
    </>
  );
}
