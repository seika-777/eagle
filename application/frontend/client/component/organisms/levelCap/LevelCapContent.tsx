"use client";
import type { ReactNode } from "react";
import { Box, SimpleGrid, TableRoot, TableHeader, TableBody, TableRow, TableColumnHeader, TableCell, Text } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import { LEVEL_CAP_PAGE } from "@/const/pages/LEVEL_CAP_PAGE";
import type { LevelCapGuideSection } from "@/const/type/levelCap/LevelCapGuideSectionType";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import type { LevelCapItemType } from "@/const/type/levelCap/LevelCapType";

type Props = {
  items: LevelCapItemType[];
  beltType: string;
  guide: LevelCapGuideSection[];
  gmRewardDescription: string;
  processFootnote: string;
};

export default function LevelCapContent({ items, beltType, guide, gmRewardDescription, processFootnote }: Props) {
  const th = {
    bg: STYLE_COLOR.PRIMARY,
    color: STYLE_COLOR.WHITE,
    fontWeight: "bold" as const,
    fontSize: "xs",
    whiteSpace: "nowrap" as const,
    borderBottom: "none",
    px: 3,
    py: 2,
  };

  const rowBg = (i: number) => (i % 2 === 0 ? STYLE_COLOR.WHITE : STYLE_COLOR.LIGHT);

  const calcExpLimit = (fCountLimit: number) => fmt(fCountLimit * 50);

  const formatMinExp = (value: number, prevValue: number | undefined) => {
    if (prevValue === undefined) return fmt(value);
    return `${fmt(value)}(+${fmt(value - prevValue)})`;
  };

  const fmt = (value: number) => value.toLocaleString();
  const str = (value: number | null) => (value !== null ? fmt(value) : "-");

  const SectionTable = ({ headers, rows, footnote }: { headers: string[]; rows: ReactNode[]; footnote?: string }) => (
    <Box>
      <Box width="100%" minWidth="0" border={`1px solid ${STYLE_COLOR.BORDER}`} borderRadius="md" overflowX="auto">
        <TableRoot size="sm">
          <TableHeader>
            <TableRow>
              {headers.map((h, i) => (
                <TableColumnHeader
                  key={h}
                  {...th}
                  borderRight={i < headers.length - 1 ? `1px solid ${STYLE_COLOR.SECONDARY}40` : "none"}
                >
                  {h}
                </TableColumnHeader>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{rows}</TableBody>
        </TableRoot>
      </Box>
      {footnote && (
        <Text fontSize="xs" color="gray.500" mt={1} whiteSpace="pre-line">{footnote}</Text>
      )}
    </Box>
  );

  const cell = (value: string, i: number, col: number, isLast = false, isLv = false) => (
    <TableCell
      key={`${i}-${col}`}
      whiteSpace="nowrap"
      fontSize="sm"
      px={3}
      py={2}
      color={isLv ? STYLE_COLOR.PRIMARY : STYLE_COLOR.BLACK}
      fontWeight={isLv ? "bold" : "normal"}
      borderRight={isLast ? "none" : `1px solid ${STYLE_COLOR.BORDER}`}
      borderBottom={`1px solid ${STYLE_COLOR.LIGHT}`}
    >
      {value}
    </TableCell>
  );

  const processHeaders = [
    LEVEL_CAP_PAGE.TEXT.levelHeader,
    LEVEL_CAP_PAGE.TEXT.minExpHeader,
    LEVEL_CAP_PAGE.TEXT.minGrowthHeader,
    LEVEL_CAP_PAGE.TEXT.minRewardHeader,
    LEVEL_CAP_PAGE.TEXT.minHonorHeader,
    LEVEL_CAP_PAGE.TEXT.maxAdventurerRankHeader,
  ];

  const gmHeaders = [
    LEVEL_CAP_PAGE.TEXT.levelHeader,
    LEVEL_CAP_PAGE.TEXT.rewardAmountHeader,
    LEVEL_CAP_PAGE.TEXT.offBalanceRewardHeader,
    LEVEL_CAP_PAGE.TEXT.honorHeader,
  ];

  const sessionHeaders = [
    LEVEL_CAP_PAGE.TEXT.levelHeader,
    LEVEL_CAP_PAGE.TEXT.distributionHeader,
    LEVEL_CAP_PAGE.TEXT.rewardPerSessionHeader,
    LEVEL_CAP_PAGE.TEXT.swordFragmentsHeader,
    LEVEL_CAP_PAGE.TEXT.growthCountHeader,
    LEVEL_CAP_PAGE.TEXT.growthLimitHeader,
    LEVEL_CAP_PAGE.TEXT.expLimitHeader,
    LEVEL_CAP_PAGE.TEXT.fCountLimitHeader,
    LEVEL_CAP_PAGE.TEXT.rewardLimitHeader,
    LEVEL_CAP_PAGE.TEXT.excessGrowthHeader,
  ];

  return (
    <Box as="section" textAlign="left" width="100%">
      <HeadingSecond title={`${LEVEL_CAP_PAGE.TEXT.title} ${beltType}`} />
      <SimpleGrid gap={3} mt={4} mb={8}>
        {guide.map((section) => (
          <Box key={section.title}>
            <Text fontSize="sm" fontWeight="bold" color={STYLE_COLOR.PRIMARY}>【{section.title}】</Text>
            <Text fontSize="sm" color={STYLE_COLOR.BLACK} whiteSpace="pre-line">{section.description}</Text>
          </Box>
        ))}
      </SimpleGrid>
      <SimpleGrid gap={8} width="100%">

        <Box minWidth="0">
          <Text fontSize="md" fontWeight="bold" mb={2}>{LEVEL_CAP_PAGE.TEXT.processTitle}</Text>
          <SectionTable
            headers={processHeaders}
            rows={items.map((item, i) => (
              <TableRow key={`process-${item.id}`} bg={rowBg(i)}>
                {cell(item.level, i, 0, false, true)}
                {cell(formatMinExp(item.minExp, items[i - 1]?.minExp), i, 1)}
                {cell(str(item.minGrowth), i, 2)}
                {cell(fmt(item.minReward), i, 3)}
                {cell(str(item.minHonor), i, 4)}
                {cell(item.maxAdventurerRank, i, 5, true)}
              </TableRow>
            ))}
          />
        </Box>

        <Box minWidth="0">
          <Text fontSize="md" fontWeight="bold" mb={2}>{LEVEL_CAP_PAGE.TEXT.gmRewardTitle}</Text>
          <Text fontSize="sm" color={STYLE_COLOR.BLACK} mb={3} whiteSpace="pre-line">{gmRewardDescription}</Text>
          <SectionTable
            headers={gmHeaders}
            rows={items.map((item, i) => (
              <TableRow key={`gm-${item.id}`} bg={rowBg(i)}>
                {cell(item.level, i, 0, false, true)}
                {cell(fmt(item.rewardAmount), i, 1)}
                {cell(fmt(item.offBalanceReward), i, 2)}
                {cell(fmt(item.honor), i, 3, true)}
              </TableRow>
            ))}
          />
        </Box>

        <Box minWidth="0">
          <Text fontSize="md" fontWeight="bold" mb={2}>{LEVEL_CAP_PAGE.TEXT.sessionRewardTitle}</Text>
          <SectionTable
            headers={sessionHeaders}
            footnote={processFootnote}
            rows={items.map((item, i) => (
              <TableRow key={`session-${item.id}`} bg={rowBg(i)}>
                {cell(i === items.length - 1 ? `${item.level}※` : item.level, i, 0, false, true)}
                {cell(str(item.distribution), i, 1)}
                {cell(item.rewardPerSession, i, 2)}
                {cell(item.swordFragments, i, 3)}
                {cell(fmt(item.growthCount), i, 4)}
                {cell(fmt(item.growthLimit), i, 5)}
                {cell(calcExpLimit(item.fCountLimit), i, 6)}
                {cell(fmt(item.fCountLimit), i, 7)}
                {cell(fmt(item.rewardLimit), i, 8)}
                {cell(item.excessGrowth || "-", i, 9, true)}
              </TableRow>
            ))}
          />
        </Box>

      </SimpleGrid>
    </Box>
  );
}
