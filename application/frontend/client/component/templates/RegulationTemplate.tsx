"use client";
import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getRegulationItemByPeriod } from "@/api/variables/getRegulationItems";
import MainVisual from "@/component/organisms/top/MainVisual";
import RegulationSection from "@/component/organisms/regulation/RegulationSection";
import { STYLE } from "@/const/common/STYLE";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";
import type { RaceItemType } from "@/const/type/race/RaceItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
type Props = {
  period?: string;
};
export default function RegulationTemplate({ period }: Props) {
  const [regulation, setRegulation] = useState<RegulationItemType>();
  const { handleError, resetError } = useErrorHandler();
  useEffect(() => {
    resetError();
    const fetchData = async () => {
      try {
        if (period) {
          const responseGetRegulationItem = await getRegulationItemByPeriod(period);
          if (responseGetRegulationItem) {
            setRegulation(responseGetRegulationItem);
          }
        }
      } catch (error) {
        handleError(error as ErrorType);
      }
    };
    fetchData();
  }, [period]);
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        {regulation && <RegulationSection regulationItem={regulation} />}
      </Box>
    </>
  );
}
