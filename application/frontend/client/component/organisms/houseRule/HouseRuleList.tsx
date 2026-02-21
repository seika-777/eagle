"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Text, Link, Spinner, SimpleGrid } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getHouseRuleItems } from "@/api/variables/getHouseRuleItems";
import { RULE } from "@/const/common/RULE";
import type { HouseRuleItemType } from "@/const/type/houseRule/HouseRuleItemType";
import type { RuleType } from "@/const/type/common/RuleType";
import type { ErrorType } from "@/const/type/error/ErrorType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

export default function HouseRuleList() {
  const [items, setItems] = useState<HouseRuleItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, resetError } = useErrorHandler();

  useEffect(() => {
    setLoading(true);
    resetError();
    const fetchData = async () => {
      try {
        const data = await getHouseRuleItems();
        setItems(data);
        setLoading(false);
      } catch (error) {
        handleError(error as ErrorType);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      {loading ? (
        <Spinner />
      ) : (
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
              <SimpleGrid gap={4} mt={2}>
                {groupItems.map((item) => (
                  <Box key={item.id} p={4} borderWidth="1px" borderRadius="md">
                    <Text fontWeight="bold" mb={2}>
                      {item.about}
                    </Text>
                    <Text whiteSpace="pre-wrap">{item.description}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
