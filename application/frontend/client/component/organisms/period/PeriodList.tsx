"use client";
import { Box } from "@chakra-ui/react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { PERIOD_PAGE } from "@/const/pages/PERIOD_PAGE";
import type { RegulationRow } from "@/const/function/getRegulationItems";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

type Props = {
  items: RegulationRow[];
};

export default function PeriodList({ items }: Props) {

  const PeriodItem = ({ item }: { item: RegulationRow }) => {
    return (
      <Box as="li" py={1}>
        <Link
          as={NextLink}
          href={`/${item.id}`}
          color={STYLE_COLOR.SECONDARY}
          textDecoration="underline"
          _hover={{ color: STYLE_COLOR.ACCENT }}
        >
          {item.name}
        </Link>
      </Box>
    );
  };

  return (
    <Box as="section" textAlign="left" width="100%">
      <Box>
        <HeadingSecond title={PERIOD_PAGE.TEXT.heading} />
        <Box as="ul" listStyleType="none" p={0} mt={2}>
          {items.map((item) => (
            <PeriodItem key={item.id} item={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
