"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Spinner, SimpleGrid } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getItems } from "@/const/function/getItems";
import { STAGE_TERM_PAGE } from "@/const/pages/STAGE_TERM_PAGE";
import type { StageTermItemType } from "@/const/type/stageTerm/StageTermItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
import { Text } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import AccordionList from "@/component/molecules/AccordionList";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

const CONTINENT_ORDER = ["alframe", "keldeon", "terastier", "reseldawn"] as const;

const CONTINENT_LABEL: Record<string, string> = {
  alframe: "アルフレイム大陸",
  keldeon: "ケルディオン大陸",
  terastier: "テラスティア大陸",
  reseldawn: "レーゼルドーン大陸",
};

const ITEM_TYPE_ORDER = ["stage", "npc"] as const;

const ITEM_TYPE_LABEL: Record<string, string> = {
  stage: "舞台",
  npc: "NPC",
};

export default function StageTermList() {
  const [items, setItems] = useState<StageTermItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, resetError } = useErrorHandler();

  useEffect(() => {
    setLoading(true);
    resetError();
    const fetchData = async () => {
      try {
        const data = await getItems<StageTermItemType>("stage-term");
        setItems(data);
        setLoading(false);
      } catch (error) {
        handleError(error as ErrorType);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const grouped = useMemo(() => {
    const continentMap: Partial<Record<string, Partial<Record<string, StageTermItemType[]>>>> = {};
    items.forEach((item) => {
      if (!continentMap[item.continent]) continentMap[item.continent] = {};
      const typeMap = continentMap[item.continent]!;
      if (!typeMap[item.itemType]) typeMap[item.itemType] = [];
      typeMap[item.itemType]!.push(item);
    });
    return continentMap;
  }, [items]);

  const orderedContinents = useMemo(() => {
    return CONTINENT_ORDER.filter((c) => grouped[c]).map((c) => {
      const typeMap = grouped[c]!;
      const knownTypes = ITEM_TYPE_ORDER.filter((t) => typeMap[t]).map((t) => ({
        typeKey: t,
        label: ITEM_TYPE_LABEL[t],
        items: typeMap[t]!,
      }));
      const otherTypes = Object.keys(typeMap)
        .filter((t) => !ITEM_TYPE_ORDER.includes(t as (typeof ITEM_TYPE_ORDER)[number]))
        .map((t) => ({ typeKey: t, label: t, items: typeMap[t]! }));
      return { continent: c, label: CONTINENT_LABEL[c], types: [...knownTypes, ...otherTypes] };
    });
  }, [grouped]);

  return (
    <Box as="section" textAlign="left" width="100%">
      <HeadingSecond title={STAGE_TERM_PAGE.TEXT.heading} />
      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Text mt={4}>{STAGE_TERM_PAGE.TEXT.empty}</Text>
      ) : (
        <SimpleGrid gap={10} mt={4}>
          {orderedContinents.map(({ continent, label, types }) => (
            <Box key={continent}>
              <Text
                as="h3"
                fontSize="22px"
                fontWeight="bold"
                pb={1}
                borderBottom={`3px solid ${STYLE_COLOR.SECONDARY}`}
                fontFamily="var(--font-edu-nsw-act-cursive), var(--font-zen-maru-gothic)"
              >
                {label}
              </Text>
              <SimpleGrid gap={6} mt={3}>
                {types.map(({ typeKey, label: typeLabel, items: typeItems }) => (
                  <Box key={typeKey}>
                    <Box
                      as="h4"
                      fontSize="16px"
                      fontWeight="bold"
                      color={STYLE_COLOR.BLACK}
                      mb={2}
                      fontFamily="var(--font-edu-nsw-act-cursive), var(--font-zen-maru-gothic)"
                    >
                      {typeLabel}
                    </Box>
                    <AccordionList
                      items={typeItems.map((item) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        footer: item.regulationNames.length > 0 ? `関連期：${item.regulationNames.join("、")}` : null,
                      }))}
                      htmlDescription={true}
                    />
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
