"use client";
import { useEffect, useState } from "react";
import { Box, VStack, HStack, Flex, SimpleGrid, Text, Spinner, Alert } from "@chakra-ui/react";
import {
  LuSparkles,
  LuTrendingUp,
  LuCoins,
  LuStar,
  LuInfo,
  LuTarget,
  LuCircleCheck,
} from "react-icons/lu";
import { resolveCurrentLevelCap } from "@/const/function/resolveCurrentLevelCap";
import { calcGrowthGuide } from "@/const/function/calcGrowthGuide";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { MYPAGE } from "@/const/pages/MYPAGE";
import type { GrowthGuideItemType, GrowthGuideKind } from "@/const/type/mypage/GrowthGuideType";
import type { YutosheetJsonType } from "@/const/type/mypage/YutosheetJsonType";
import type { LatestScheduledRegulationType } from "@/const/type/mypage/LatestScheduledRegulationType";

type Props = {
  regulation: LatestScheduledRegulationType;
  registeredUrl: string;
};

// 取得状態の判別用。loading 後にどの表示にするかを 1 つの state で表す。
type GuideStatus = "noUrl" | "ready";

export default function GrowthGuide({ regulation, registeredUrl }: Props) {
  const { errorAlertDescription, handleError } = useErrorHandler();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<GuideStatus>("noUrl");
  const [items, setItems] = useState<GrowthGuideItemType[]>([]);
  const [currentLevel, setCurrentLevel] = useState("");

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        // 1. 本人のゆとシート URL（props）。未登録なら設定セクションへ誘導。
        if (registeredUrl === "") {
          setStatus("noUrl");
          return;
        }

        // 2. ゆとシート JSON を /api/yutosheet 経由で取得。
        const res = await fetch(
          `/api/yutosheet?url=${encodeURIComponent(registeredUrl)}`,
          { method: "GET", headers: { Accept: "application/json" } }
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch yutosheet: ${res.status}`);
        }
        const yutosheet = (await res.json()) as YutosheetJsonType;

        // 3. 現在のレベルキャップを解決。null（未開始）なら GUIDE_NONE（items 空）。
        const levelCap = await resolveCurrentLevelCap(
          regulation.levelCapSchedule,
          regulation.levelCapBelt
        );
        if (levelCap === null) {
          setItems([]);
          setStatus("ready");
          return;
        }
        setCurrentLevel(levelCap.level);

        // 4. 成長指示計算。
        const guide = calcGrowthGuide({
          expTotal: yutosheet.expTotal,
          historyGrowTotal: yutosheet.historyGrowTotal,
          historyMoneyTotal: yutosheet.historyMoneyTotal,
          historyHonorTotal: yutosheet.historyHonorTotal,
          minExp: levelCap.minExp,
          minGrowth: levelCap.minGrowth,
          minReward: levelCap.minReward,
          minHonor: levelCap.minHonor,
          expDiff: levelCap.expDiff,
        });
        setItems(guide);
        setStatus("ready");
      } catch (err) {
        handleError({ body: { detail: String(err) }, status: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [handleError, regulation, registeredUrl]);

  // kind ごとのラベル・単位を組み立てる（文言は MYPAGE 定数から）。
  const labelOf = (kind: GrowthGuideKind): string => {
    if (kind === "exp") return MYPAGE.TEXT.GUIDE_EXP;
    if (kind === "growth") return MYPAGE.TEXT.GUIDE_GROWTH;
    if (kind === "reward") return MYPAGE.TEXT.GUIDE_REWARD;
    return MYPAGE.TEXT.GUIDE_HONOR;
  };

  const unitOf = (kind: GrowthGuideKind): string => {
    if (kind === "exp") return String(MYPAGE.VALUE.UNIT_EXP);
    if (kind === "growth") return String(MYPAGE.VALUE.UNIT_GROWTH);
    if (kind === "reward") return String(MYPAGE.VALUE.UNIT_REWARD);
    return String(MYPAGE.VALUE.UNIT_HONOR);
  };

  const iconOf = (kind: GrowthGuideKind) => {
    if (kind === "exp") return <LuSparkles size={16} />;
    if (kind === "growth") return <LuTrendingUp size={16} />;
    if (kind === "reward") return <LuCoins size={16} />;
    return <LuStar size={16} />;
  };

  const GuideItem = ({ item }: { item: GrowthGuideItemType }) => (
    <VStack
      as="li"
      align="stretch"
      gap={1}
      listStyleType="none"
      bg={STYLE_COLOR.WHITE}
      borderWidth="1px"
      borderColor={STYLE_COLOR.BORDER}
      borderRadius="xl"
      px={4}
      py={3}
    >
      <HStack gap={2} color={STYLE_COLOR.SECONDARY}>
        <Box>{iconOf(item.kind)}</Box>
        <Text fontSize="sm" fontWeight="bold">
          {labelOf(item.kind)}
        </Text>
      </HStack>
      <HStack align="baseline" gap={1}>
        <Text fontSize="2xl" fontWeight="bold" color={STYLE_COLOR.PRIMARY}>
          +{item.value.toLocaleString()}
        </Text>
        <Text fontSize="sm" color={STYLE_COLOR.BLACK}>
          {unitOf(item.kind)}
        </Text>
      </HStack>
    </VStack>
  );

  return (
    <Box>
      {loading && (
        <Flex justify="center" py={6}>
          <Spinner color={STYLE_COLOR.PRIMARY} />
        </Flex>
      )}
      {errorAlertDescription !== "" && (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Description>{errorAlertDescription}</Alert.Description>
        </Alert.Root>
      )}
      {!loading && status === "noUrl" && (
        <HStack align="flex-start" gap={3} bg={STYLE_COLOR.LIGHT} borderRadius="xl" px={4} py={4}>
          <Box color={STYLE_COLOR.PRIMARY}>
            <LuInfo size={20} />
          </Box>
          <Text color={STYLE_COLOR.BLACK} fontSize="sm">
            {MYPAGE.TEXT.NO_URL}
          </Text>
        </HStack>
      )}
      {!loading && status === "ready" && (
        <VStack align="stretch" gap={4}>
          <Flex align="center" justify="space-between" gap={3} wrap="wrap">
            <HStack gap={2}>
              <Box color={STYLE_COLOR.PRIMARY}>
                <LuTarget size={22} />
              </Box>
              <Text fontSize="18px" fontWeight="bold" color={STYLE_COLOR.PRIMARY}>
                {MYPAGE.TEXT.GUIDE_LABEL}
              </Text>
            </HStack>
            {currentLevel !== "" && (
              <HStack
                gap={2}
                bg={STYLE_COLOR.PRIMARY}
                color={STYLE_COLOR.WHITE}
                px={3}
                py={1}
                borderRadius="full"
              >
                <Text as="span" fontSize="xs">
                  {MYPAGE.TEXT.CURRENT_LEVEL}
                </Text>
                <Text as="span" fontSize="md" fontWeight="bold">
                  {currentLevel}
                </Text>
              </HStack>
            )}
          </Flex>
          {items.length === 0 && (
            <HStack
              gap={3}
              bg={STYLE_COLOR.WHITE}
              borderWidth="1px"
              borderColor={STYLE_COLOR.BORDER}
              borderRadius="xl"
              px={4}
              py={4}
            >
              <Box color={STYLE_COLOR.SUCCESS}>
                <LuCircleCheck size={22} />
              </Box>
              <Text fontSize="16px" fontWeight="medium" color={STYLE_COLOR.BLACK}>
                {MYPAGE.TEXT.GUIDE_NONE}
              </Text>
            </HStack>
          )}
          {items.length > 0 && (
            <VStack align="stretch" gap={3}>
              <Text fontSize="sm" color={STYLE_COLOR.BLACK}>
                {MYPAGE.TEXT.GUIDE_DESC}
              </Text>
              <SimpleGrid as="ul" columns={{ base: 1, sm: 2 }} gap={3}>
                {items.map((item) => (
                  <GuideItem key={item.kind} item={item} />
                ))}
              </SimpleGrid>
            </VStack>
          )}
        </VStack>
      )}
    </Box>
  );
}
