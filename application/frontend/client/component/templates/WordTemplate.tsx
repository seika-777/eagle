"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import WordList from "@/component/organisms/word/WordList";
import { STYLE } from "@/const/common/STYLE";

export default function WordTemplate() {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <WordList />
      </Box>
    </>
  );
}
