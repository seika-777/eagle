"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import SchoolList from "@/component/organisms/school/SchoolList";
import { STYLE } from "@/const/common/STYLE";
import type { SchoolItemType } from "@/const/type/school/SchoolItemType";

type Props = {
  items: SchoolItemType[];
};

export default function SchoolTemplate({ items }: Props) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <SchoolList items={items} />
      </Box>
    </>
  );
}
