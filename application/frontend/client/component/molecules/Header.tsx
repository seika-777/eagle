"use client";
import { Box } from "@chakra-ui/react";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { COMMON } from "@/const/common/COMMON";

export default function Header() {
  return (
    <Box
      as="header"
      display={"flex"}
      position={"fixed"}
      width={"100%"}
      top={0}
      border={`0.5px solid ${STYLE_COLOR.WHITE}`}
      borderRadius={"30px"}
      alignItems={"center"}
      justifyContent={"center"}
      height={"60px"}
      zIndex={5}
      color={STYLE_COLOR.PRIMARY}
      fontSize={"16px"}
    >
      {COMMON.SITE_NAME}
    </Box>
  );
}
