"use client";
import { useMemo } from "react";
import { Box, Link, SimpleGrid } from "@chakra-ui/react";
import { RULE } from "@/const/common/RULE";
import type { HouseRuleItemType } from "@/const/type/houseRule/HouseRuleItemType";
import type { RuleType } from "@/const/type/common/RuleType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";
import AccordionList from "@/component/molecules/AccordionList";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

type Props = {
  items: HouseRuleItemType[];
};

export default function HouseRuleList({ items }: Props) {

  const groupedByRuleType = useMemo(() => {
    const groups: Partial<Record<RuleType, HouseRuleItemType[]>> = {};
    items.forEach((item) => {
      if (!groups[item.ruleType]) {
        groups[item.ruleType] = [];
      }
      groups[item.ruleType]!.push(item);
    });
    return groups;
  }, [items]);

  const orderedEntries = useMemo(() => {
    return RULE.TYPE_ORDER.filter((rt) => groupedByRuleType[rt]).map((rt) => ({
      ruleType: rt,
      label: RULE.TEXT[rt],
      items: groupedByRuleType[rt]!,
    }));
  }, [groupedByRuleType]);

  return (
    <Box as="section" textAlign="left" width="100%">
      <HeadingSecond title="ハウスルール" />
      <SimpleGrid gap={8} mt={4}>
        <Box as="nav">
          <HeadingThird title="目次" />
          <Box as="ul" listStyleType="none" p={0} mt={2}>
            {orderedEntries.map(({ ruleType, label }) => (
              <Box as="li" key={ruleType} py={1}>
                <Link
                  href={`#house-rule-${ruleType}`}
                  color={STYLE_COLOR.SECONDARY}
                  textDecoration="underline"
                  _hover={{ color: STYLE_COLOR.ACCENT }}
                >
                  {label}
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
        {orderedEntries.map(({ ruleType, label, items: groupItems }) => (
          <Box key={ruleType} id={`house-rule-${ruleType}`}>
            <HeadingThird title={label} />
            <Box mt={2}>
              <AccordionList
                items={groupItems.map((item) => ({
                  id: item.id,
                  title: item.about,
                  description: item.description,
                }))}
              />
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
