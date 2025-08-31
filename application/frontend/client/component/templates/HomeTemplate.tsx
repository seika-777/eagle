"use client";
import { Box } from "@chakra-ui/react";
import About from "@/component/organisms/pre/About";
import Contact from "@/component/organisms/pre/Contact";
import MainVisual from "@/component/organisms/pre/MainVisual";
import Recruitment from "@/component/organisms/pre/Recruitment";
import Regulation from "@/component/organisms/pre/Regulation";
import Stage from "@/component/organisms/pre/Stage";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

export default function HomeTemplate() {
  return (
    <Box bgColor={STYLE_COLOR.COMMON}>
      <MainVisual />
      <Stage />
      <About />
      <Recruitment />
      <Regulation />
      <Contact />
    </Box>
  );
}
