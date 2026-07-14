"use client";
import { Box } from "@chakra-ui/react";
import { HOUSE_RULE_PAGE } from "@/const/pages/HOUSE_RULE_PAGE";
import type { HouseRuleItemType } from "@/const/type/houseRule/HouseRuleItemType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import AccordionList from "@/component/molecules/AccordionList";

type Props = {
  items: HouseRuleItemType[];
};

export default function HouseRuleList({ items }: Props) {
  return (
    <Box as="section" textAlign="left" width="100%">
      <HeadingSecond title={HOUSE_RULE_PAGE.TEXT.heading} />
      <Box mt={4}>
        <AccordionList
          items={items.map((item) => ({
            id: item.id,
            title: item.about,
            description: item.description,
            label: item.isProhibition ? HOUSE_RULE_PAGE.TEXT.prohibition : HOUSE_RULE_PAGE.TEXT.houseRule,
          }))}
        />
      </Box>
    </Box>
  );
}
