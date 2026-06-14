"use client";
import { Box, Text } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import RegulationSheetForm from "@/component/organisms/mypage/RegulationSheetForm";
import { STYLE } from "@/const/common/STYLE";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { MYPAGE } from "@/const/pages/MYPAGE";

export default function MyPageTemplate() {
  return (
    <Box maxW={STYLE.WIDTH.SECTION} mx="auto" px={6} pt={"calc(60px + 2.5rem)"} pb={16}>
      <Box mb={8}>
        <HeadingSecond title={MYPAGE.TEXT.TITLE} />
        <Text mt={2} fontSize="sm" color={STYLE_COLOR.BLACK} opacity={0.75}>
          {MYPAGE.TEXT.SUBTITLE}
        </Text>
      </Box>
      <RegulationSheetForm />
    </Box>
  );
}
