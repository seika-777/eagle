"use client";
import { useEffect, useState } from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getLatestRegulationItem } from "@/const/function/getRegulationItems";
import About from "@/component/organisms/top/About";
import Contact from "@/component/organisms/top/Contact";
import MainVisual from "@/component/organisms/top/MainVisual";
import Recruitment from "@/component/organisms/top/Recruitment";
import Regulation from "@/component/organisms/top/Regulation";
import Stage from "@/component/organisms/top/Stage";
import { STYLE } from "@/const/common/STYLE";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
export default function HomeTemplate() {
  const [latestRegulation, setLatestRegulation] = useState<RegulationItemType | null>(null);
  const { handleError, resetError } = useErrorHandler();
  useEffect(() => {
    resetError();
    const fetchData = async () => {
      try {
        const item = await getLatestRegulationItem();
        setLatestRegulation(item);
      } catch (error) {
        handleError(error as ErrorType);
      }
    };
    fetchData();
  }, []);
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
