"use client";
import { useParams } from "next/navigation";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import SchoolList from "@/component/organisms/school/SchoolList";
import { STYLE } from "@/const/common/STYLE";

export default function SchoolTemplate() {
  const { period } = useParams<{ period: string }>();
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <SchoolList period={period} />
      </Box>
    </>
  );
}
