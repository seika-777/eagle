"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import WordList from "@/component/organisms/word/WordList";
import { STYLE } from "@/const/common/STYLE";
import type { WordItemType } from "@/const/type/word/WordItemType";

type Props = {
  items: WordItemType[];
};

export default function WordTemplate({ items }: Props) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <WordList items={items} />
      </Box>
    </>
  );
}
