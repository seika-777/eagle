"use client";
import { useEffect, useState } from "react";
import { Box, VStack, Stack, HStack, Flex, Text, Alert, Spinner, Link } from "@chakra-ui/react";
import { LuStar, LuUser, LuStickyNote, LuPencil, LuExternalLink } from "react-icons/lu";
import AppButton from "@/component/atoms/AppButton";
import GrowthGuide from "@/component/organisms/mypage/GrowthGuide";
import TextInputField from "@/component/molecules/field/TextInputField";
import TextareaField from "@/component/molecules/field/TextareaField";
import { getScheduledRegulations } from "@/const/function/getScheduledRegulations";
import { getUserRegulationSheet } from "@/const/function/getUserRegulationSheet";
import { getLatestScheduledRegulation } from "@/const/function/getLatestScheduledRegulation";
import { validateYutosheetUrl } from "@/const/function/validateYutosheetUrl";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { MYPAGE } from "@/const/pages/MYPAGE";
import type { LatestScheduledRegulationType } from "@/const/type/mypage/LatestScheduledRegulationType";
import type { UserRegulationSheetType } from "@/const/type/mypage/UserRegulationSheetType";
import type { YutosheetJsonType } from "@/const/type/mypage/YutosheetJsonType";

export default function RegulationSheetForm() {
  const { errorAlertDescription, handleError, resetError } = useErrorHandler();
  const [regulations, setRegulations] = useState<LatestScheduledRegulationType[]>([]);
  const [sheets, setSheets] = useState<UserRegulationSheetType[]>([]);
  const [latest, setLatest] = useState<LatestScheduledRegulationType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regs, userSheets, latestReg] = await Promise.all([
          getScheduledRegulations(),
          getUserRegulationSheet(),
          getLatestScheduledRegulation(),
        ]);
        setRegulations(regs);
        setSheets(userSheets);
        setLatest(latestReg);
      } catch (err) {
        handleError({ body: { detail: String(err) }, status: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [handleError]);

  const findSheet = (regulationId: number): UserRegulationSheetType | undefined =>
    sheets.find((sheet) => sheet.regulationId === regulationId);

  // 最新レギュレーションのブロックを先頭に並べ替える（最新が null なら元順）。
  const orderRegulations = (): LatestScheduledRegulationType[] => {
    if (latest === null) {
      return regulations;
    }
    const latestId = latest.id;
    const head = regulations.filter((reg) => reg.id === latestId);
    const rest = regulations.filter((reg) => reg.id !== latestId);
    return [...head, ...rest];
  };

  // 1 レギュレーション分のブロック。親内 const として定義（規約 7・8）。
  const RegulationBlock = ({ regulation }: { regulation: LatestScheduledRegulationType }) => {
    const saved = findSheet(regulation.id);
    const isLatest = latest !== null && latest.id === regulation.id;
    const [url, setUrl] = useState(saved?.yutosheetUrl ?? "");
    const [note, setNote] = useState(saved?.note ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [invalidUrl, setInvalidUrl] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [characterName, setCharacterName] = useState("");

    // 表示モードのリンクテキスト用にキャラクター名を取得する。
    const loadCharacterName = async () => {
      if (url === "" || validateYutosheetUrl(url) === null) {
        setCharacterName("");
        return;
      }
      try {
        const res = await fetch(`/api/yutosheet?url=${encodeURIComponent(url)}`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch yutosheet: ${res.status}`);
        }
        const yutosheet = (await res.json()) as YutosheetJsonType;
        setCharacterName(yutosheet.characterName);
      } catch (err) {
        handleError({ body: { detail: String(err) }, status: 0 });
      }
    };

    useEffect(() => {
      loadCharacterName();
    }, [url]);

    const handleEdit = () => {
      setIsSaved(false);
      setInvalidUrl(false);
      setIsEditing(true);
    };

    const handleCancel = () => {
      setUrl(saved?.yutosheetUrl ?? "");
      setNote(saved?.note ?? "");
      setInvalidUrl(false);
      setIsSaved(false);
      setIsEditing(false);
    };

    const handleSave = async () => {
      resetError();
      setIsSaved(false);
      setInvalidUrl(false);

      // クライアント側でも軽く検証（空文字は許可。サーバーが最終防御）。
      if (url !== "" && validateYutosheetUrl(url) === null) {
        setInvalidUrl(true);
        return;
      }

      setIsSaving(true);
      try {
        const res = await fetch("/api/mypage", {
          method: "PUT",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            regulationId: regulation.id,
            yutosheetUrl: url,
            note,
          }),
        });
        if (!res.ok) {
          throw new Error(`Failed to save: ${res.status}`);
        }
        setIsSaved(true);
        setIsEditing(false);
      } catch (err) {
        handleError({ body: { detail: String(err) }, status: 0 });
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <Box
        bg={STYLE_COLOR.WHITE}
        borderWidth="1px"
        borderColor={isLatest ? STYLE_COLOR.SECONDARY : STYLE_COLOR.BORDER}
        borderRadius="2xl"
        boxShadow={isLatest ? "lg" : "sm"}
        overflow="hidden"
      >
        <Flex
          align="center"
          justify="space-between"
          px={5}
          py={4}
          bg={isLatest ? STYLE_COLOR.PRIMARY : STYLE_COLOR.COMMON}
        >
          <Text
            as="h3"
            fontSize="20px"
            fontWeight="bold"
            fontFamily="var(--font-edu-nsw-act-cursive), var(--font-zen-maru-gothic)"
            color={isLatest ? STYLE_COLOR.WHITE : STYLE_COLOR.PRIMARY}
          >
            {regulation.name}
          </Text>
          {isLatest && (
            <HStack
              bg={STYLE_COLOR.ACCENT}
              color={STYLE_COLOR.WHITE}
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
              gap={1}
            >
              <LuStar size={12} />
              <Text as="span">{MYPAGE.TEXT.LATEST_BADGE}</Text>
            </HStack>
          )}
        </Flex>
        <Box px={5} py={5}>
          {!isEditing && (
            <VStack align="stretch" gap={4}>
              <HStack align="flex-start" gap={3}>
                <Flex
                  align="center"
                  justify="center"
                  boxSize="40px"
                  borderRadius="full"
                  bg={STYLE_COLOR.LIGHT}
                  color={STYLE_COLOR.PRIMARY}
                  flexShrink={0}
                >
                  <LuUser size={20} />
                </Flex>
                <Box flex="1" minW={0}>
                  <Text fontSize="xs" fontWeight="bold" color={STYLE_COLOR.SECONDARY} mb={1}>
                    {MYPAGE.TEXT.CHARACTER_LABEL}
                  </Text>
                  {url === "" && (
                    <Text color={STYLE_COLOR.BLACK} fontWeight="medium">
                      {MYPAGE.TEXT.UNREGISTERED}
                    </Text>
                  )}
                  {url !== "" && validateYutosheetUrl(url) !== null && (
                    <Link
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      color={STYLE_COLOR.PRIMARY}
                      fontWeight="bold"
                      wordBreak="break-all"
                      display="inline-flex"
                      alignItems="center"
                      gap={1}
                      _hover={{ color: STYLE_COLOR.ACCENT }}
                    >
                      {characterName !== "" ? characterName : url}
                      <LuExternalLink size={14} />
                    </Link>
                  )}
                  {url !== "" && validateYutosheetUrl(url) === null && (
                    <Text color={STYLE_COLOR.BLACK} wordBreak="break-all">
                      {url}
                    </Text>
                  )}
                </Box>
              </HStack>
              {note !== "" && (
                <HStack align="flex-start" gap={3}>
                  <Flex
                    align="center"
                    justify="center"
                    boxSize="40px"
                    borderRadius="full"
                    bg={STYLE_COLOR.LIGHT}
                    color={STYLE_COLOR.PRIMARY}
                    flexShrink={0}
                  >
                    <LuStickyNote size={18} />
                  </Flex>
                  <Box flex="1" minW={0}>
                    <Text fontSize="xs" fontWeight="bold" color={STYLE_COLOR.SECONDARY} mb={1}>
                      {MYPAGE.TEXT.CHARACTOR_ROLE_LABEL}
                    </Text>
                    <Text color={STYLE_COLOR.BLACK} whiteSpace="pre-wrap">
                      {note}
                    </Text>
                  </Box>
                </HStack>
              )}
              <Box>
                <AppButton variant="secondary" size="sm" onClick={handleEdit}>
                  <HStack as="span" gap={1.5}>
                    <LuPencil size={14} />
                    <Text as="span">{MYPAGE.TEXT.EDIT}</Text>
                  </HStack>
                </AppButton>
              </Box>
            </VStack>
          )}
          {isEditing && (
            <Stack gap={3}>
              <TextInputField
                label={MYPAGE.TEXT.URL_LABEL}
                value={url}
                onChange={setUrl}
                placeholder={String(MYPAGE.VALUE.URL_PLACEHOLDER)}
                helperText={MYPAGE.TEXT.URL_HELP}
              />
              <TextareaField
                label={MYPAGE.TEXT.CHARACTOR_ROLE_LABEL}
                value={note}
                onChange={setNote}
                placeholder={String(MYPAGE.VALUE.NOTE_PLACEHOLDER)}
                helperText={MYPAGE.TEXT.NOTE_HELP}
                rows={3}
              />
              {invalidUrl && (
                <Text color={STYLE_COLOR.ERROR} fontSize="sm">
                  {MYPAGE.TEXT.INVALID_URL}
                </Text>
              )}
              {isSaved && (
                <Text color={STYLE_COLOR.PRIMARY} fontSize="sm">
                  {MYPAGE.TEXT.SAVED}
                </Text>
              )}
              <HStack gap={3}>
                <AppButton variant="primary" size="sm" onClick={handleSave} loading={isSaving}>
                  {MYPAGE.TEXT.SAVE}
                </AppButton>
                <AppButton variant="cancel" size="sm" onClick={handleCancel}>
                  {MYPAGE.TEXT.CANCEL}
                </AppButton>
              </HStack>
            </Stack>
          )}
        </Box>
        {isLatest && !isEditing && (
          <Box bg={STYLE_COLOR.COMMON} borderTop={`1px solid ${STYLE_COLOR.BORDER}`} px={5} py={5}>
            <GrowthGuide regulation={regulation} registeredUrl={url} />
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {loading && (
        <Flex justify="center" py={10}>
          <Spinner color={STYLE_COLOR.PRIMARY} />
        </Flex>
      )}
      {errorAlertDescription !== "" && (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Description>{errorAlertDescription}</Alert.Description>
        </Alert.Root>
      )}
      {!loading && regulations.length === 0 && (
        <Box
          bg={STYLE_COLOR.WHITE}
          borderWidth="1px"
          borderColor={STYLE_COLOR.BORDER}
          borderRadius="2xl"
          px={6}
          py={10}
          textAlign="center"
        >
          <Text color={STYLE_COLOR.BLACK}>{MYPAGE.TEXT.NO_LATEST}</Text>
        </Box>
      )}
      {!loading && regulations.length > 0 && (
        <VStack gap={6} align="stretch">
          {orderRegulations().map((regulation) => (
            <RegulationBlock key={regulation.id} regulation={regulation} />
          ))}
        </VStack>
      )}
    </Box>
  );
}
