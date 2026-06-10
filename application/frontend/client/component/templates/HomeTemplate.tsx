"use client";
import { Box, SimpleGrid } from "@chakra-ui/react";
import About from "@/component/organisms/top/About";
import Contact from "@/component/organisms/top/Contact";
import MainVisual from "@/component/organisms/top/MainVisual";
import Recruitment from "@/component/organisms/top/Recruitment";
import Regulation from "@/component/organisms/top/Regulation";
import Stage from "@/component/organisms/top/Stage";
import { STYLE } from "@/const/common/STYLE";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";

type Props = {
  latestRegulation: RegulationItemType | null;
};

export default function HomeTemplate({ latestRegulation }: Props) {
  return (
    <>
      <MainVisual />
      <SimpleGrid maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10} gap={6}>
        <Stage latestRegulation={latestRegulation} />
        <About />
        <Recruitment latestRegulation={latestRegulation} />
        <Regulation latestRegulation={latestRegulation} />
        <Contact />
      </SimpleGrid>
    </>
  );
}
