"use client";
import { Box } from "@chakra-ui/react";
import MainVisual from "@/component/organisms/top/MainVisual";
import HouseRuleList from "@/component/organisms/houseRule/HouseRuleList";
import { STYLE } from "@/const/common/STYLE";

export default function HouseRuleTemplate() {
  return (
    <>
      <MainVisual />
      <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} py={10}>
        <HouseRuleList />
      </Box>
    </>
  );
}
