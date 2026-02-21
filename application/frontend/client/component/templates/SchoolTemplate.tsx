"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import SchoolList from "@/component/organisms/school/SchoolList";
import { STYLE } from "@/const/common/STYLE";

type Props = {
  period?: string;
};

export default function SchoolTemplate({ period }: Props) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <SchoolList period={period} />
      </Box>
    </>
  );
}
