"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import RegulationSection from "@/component/organisms/regulation/RegulationSection";
import { STYLE } from "@/const/common/STYLE";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";

type Props = {
  regulation: RegulationItemType;
};

export default function RegulationTemplate({ regulation }: Props) {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <RegulationSection regulationItem={regulation} />
      </Box>
    </>
  );
}
