"use client";
import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { RxHamburgerMenu, RxCross1, RxChevronDown, RxChevronUp } from "react-icons/rx";
import Link from "next/link";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { STYLE } from "@/const/common/STYLE";
import { COMMON } from "@/const/common/COMMON";
import { NAV_ITEMS } from "@/const/common/NAV_ITEMS";
import { getRegulationItems } from "@/const/function/getRegulationItems";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [period, setPeriod] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeriod = async () => {
      const latest = await getRegulationItems("latest");
      if (latest) {
        setPeriod(String(latest.regulation.id));
      }
    };
    fetchPeriod();
  }, []);

  const navItems = NAV_ITEMS(period);

  const Backdrop = () => (
    <Box
      position={"fixed"}
      top={0}
      left={0}
      width={"100%"}
      height={"100%"}
      bg={"rgba(0,0,0,0.4)"}
      zIndex={6}
      opacity={isOpen ? 1 : 0}
      pointerEvents={isOpen ? "auto" : "none"}
      transition={"opacity 0.3s ease"}
      onClick={() => setIsOpen(false)}
    />
  );

  return (
    <>
      <Box
        as="header"
        position={"fixed"}
        width={"100%"}
        top={0}
        height={"60px"}
        zIndex={5}
        bg={STYLE_COLOR.MAIN}
        color={STYLE_COLOR.PRIMARY}
        fontSize={"16px"}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          maxW={STYLE.WIDTH.SECTION}
          mx={"auto"}
          px={6}
          height={"100%"}
        >
          <Link href="/">{COMMON.SITE_NAME}</Link>
          {!isOpen && (
            <Box
              as="button"
              onClick={() => setIsOpen(true)}
              cursor={"pointer"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              aria-label="メニューを開く"
            >
              <RxHamburgerMenu size={24} />
            </Box>
          )}
        </Box>
      </Box>
      <Backdrop />
      <Box
        position={"fixed"}
        top={0}
        right={0}
        width={"280px"}
        height={"100%"}
        bg={STYLE_COLOR.COMMON}
        zIndex={7}
        boxShadow={"-4px 0 12px rgba(0,0,0,0.15)"}
        transform={isOpen ? "translateX(0)" : "translateX(100%)"}
        transition={"transform 0.3s ease"}
      >
        <Box display={"flex"} justifyContent={"flex-end"} px={4} pt={4}>
          <Box
            as="button"
            onClick={() => setIsOpen(false)}
            cursor={"pointer"}
            color={STYLE_COLOR.PRIMARY}
            aria-label="メニューを閉じる"
          >
            <RxCross1 size={24} />
          </Box>
        </Box>
        <Box as="nav" py={4} px={6}>
          {navItems.map((item, index) => (
            <Box
              key={item.label}
              borderBottom={`1px solid ${STYLE_COLOR.LIGHT}`}
            >
              {item.children ? (
                <>
                  <Box
                    as="button"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    py={3}
                    fontSize={"15px"}
                    color={openAccordion === item.label ? STYLE_COLOR.PRIMARY : STYLE_COLOR.BLACK}
                    fontWeight={openAccordion === item.label ? "bold" : "normal"}
                    cursor="pointer"
                    onClick={() => setOpenAccordion(openAccordion === item.label ? null : item.label)}
                  >
                    {item.label}
                    {openAccordion === item.label ? <RxChevronUp size={16} /> : <RxChevronDown size={16} />}
                  </Box>
                  <Box
                    overflow="hidden"
                    maxH={openAccordion === item.label ? "200px" : "0"}
                    transition="max-height 0.3s ease"
                  >
                    <Box borderTop={`1px solid ${STYLE_COLOR.LIGHT}`}>
                      {item.children.map((child, ci) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          style={{ display: "block" }}
                        >
                          <Box
                            py={2}
                            pl={5}
                            fontSize={"14px"}
                            color={STYLE_COLOR.BLACK}
                            borderTop={ci > 0 ? `1px solid ${STYLE_COLOR.LIGHT}` : undefined}
                            _hover={{ color: STYLE_COLOR.PRIMARY }}
                          >
                            {child.label}
                          </Box>
                        </Link>
                      ))}
                    </Box>
                  </Box>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  style={{ display: "block" }}
                >
                  <Box
                    py={3}
                    fontSize={"15px"}
                    color={STYLE_COLOR.BLACK}
                    _hover={{ color: STYLE_COLOR.PRIMARY }}
                  >
                    {item.label}
                  </Box>
                </Link>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
