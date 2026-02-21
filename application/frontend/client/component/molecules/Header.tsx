"use client";
import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import Link from "next/link";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { COMMON } from "@/const/common/COMMON";
import { NAV_ITEMS } from "@/const/common/NAV_ITEMS";
import { getLatestPeriod } from "@/api/variables/getLatestPeriod";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [period, setPeriod] = useState("");

  useEffect(() => {
    const fetchPeriod = async () => {
      const latestPeriod = await getLatestPeriod();
      setPeriod(latestPeriod);
    };
    fetchPeriod();
  }, []);

  const navItems = NAV_ITEMS(period);

  const Backdrop = () => (
    <Box
      position={"fixed"}
      top={"60px"}
      left={0}
      width={"100%"}
      height={"100%"}
      bg={"rgba(0,0,0,0.4)"}
      zIndex={3}
      onClick={() => setIsOpen(false)}
    />
  );

  const MenuPanel = () => (
    <Box
      position={"fixed"}
      top={"60px"}
      left={0}
      width={"100%"}
      bg={STYLE_COLOR.COMMON}
      zIndex={4}
      boxShadow={"0 4px 12px rgba(0,0,0,0.1)"}
      py={4}
      px={6}
    >
      <Box as="nav">
        {navItems.map((item, index) => (
          <Box
            key={item.href}
            py={3}
            fontSize={"15px"}
            color={STYLE_COLOR.BLACK}
            borderBottom={index < navItems.length - 1 ? `1px solid ${STYLE_COLOR.LIGHT}` : undefined}
            _hover={{ color: STYLE_COLOR.PRIMARY }}
          >
            <Link href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <Box
        as="header"
        display={"flex"}
        width={"100%"}
        top={0}
        alignItems={"center"}
        justifyContent={"space-between"}
        height={"60px"}
        zIndex={5}
        bg={STYLE_COLOR.MAIN}
        color={STYLE_COLOR.WHITE}
        fontSize={"16px"}
        px={6}
      >
        <Box>{COMMON.SITE_NAME}</Box>
        <Box
          as="button"
          onClick={() => setIsOpen(!isOpen)}
          cursor={"pointer"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {isOpen ? <RxCross1 size={24} /> : <RxHamburgerMenu size={24} />}
        </Box>
      </Box>
      {isOpen && (
        <>
          <Backdrop />
          <MenuPanel />
        </>
      )}
    </>
  );
}
