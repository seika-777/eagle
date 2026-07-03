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
import type { SiteOptionsType } from "@/const/type/option/SiteOptionsType";

type Props = {
  latestRegulation: RegulationItemType | null;
  options: SiteOptionsType;
};

export default function HomeTemplate({ latestRegulation, options }: Props) {
  return (
    <>
      <MainVisual />
      <SimpleGrid maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10} gap={6}>
        <Stage latestRegulation={latestRegulation} />
        <About siteName={options.siteName} aboutText={options.topAboutText} />
        <Recruitment latestRegulation={latestRegulation} />
        <Regulation
          latestRegulation={latestRegulation}
          regulationText={options.topRegulationText}
        />
        <Contact
          contactText={options.topContactText}
          contactXUrl={options.topContactXUrl}
        />
      </SimpleGrid>
    </>
  );
}
