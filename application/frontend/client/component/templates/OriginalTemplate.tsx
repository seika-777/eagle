"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import OriginalList from "@/component/organisms/original/OriginalList";
import { STYLE } from "@/const/common/STYLE";

export default function OriginalTemplate() {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <OriginalList />
      </Box>
    </>
  );
}
