"use client";
import { SimpleGrid, Box, Text, Link, Alert } from "@chakra-ui/react";
import { useStateMachine } from "little-state-machine";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { updateStore } from "@/const/store/previewStore";

const LVCB_LINKS: Record<string, string> = {
  B: "https://lite.evernote.com/note/023359ca-fa3c-34e3-fffd-cafcece54a7c",
};

type Props = {
  id: string;
};

export default function RegulationPreviewTemplate({ id }: Props) {
  const { state } = useStateMachine({ actions: { updateStore } });
  const form = state.preview.regulationPreview?.form;

  const name = String(form?.name ?? "");
  const stage = String(form?.stage ?? "");
  const levelCapBelt = String(form?.levelCapBelt ?? "");
  const lvcbLink = LVCB_LINKS[levelCapBelt];

  return (
    <AdminLayoutTemplate title="プレビュー">
      {!form && (
        <Alert.Root status="warning" mb={4}>
          <Alert.Indicator />
          <Alert.Description>プレビューデータがありません。編集画面のプレビューボタンから開いてください。</Alert.Description>
        </Alert.Root>
      )}
      {form && (
        <SimpleGrid gap="4">
          <Box as="section">
            <Text as="h2" fontSize="30px">{name}</Text>
            {lvcbLink ? (
              <Link
                href={lvcbLink}
                target="_blank"
                rel="noopener noreferrer"
                color={STYLE_COLOR.SECONDARY}
                textDecoration="underline"
                _hover={{ color: STYLE_COLOR.ACCENT }}
              >
                レベルキャップシステムは{levelCapBelt}を採用
              </Link>
            ) : (
              <Text>レベルキャップシステムは{levelCapBelt}を採用</Text>
            )}
          </Box>
          <Box as="section">
            <Text as="h3" fontSize="20px">舞台</Text>
            <Text>{stage}</Text>
          </Box>
          <Box as="section">
            <Text as="h3" fontSize="20px">使用可能種族</Text>
            <Text>基本種族、サプリ一部種族、オリジナル種族</Text>
            <Link
              href={`/regulation/${id}/preview/race`}
              color={STYLE_COLOR.SECONDARY}
              textDecoration="underline"
              _hover={{ color: STYLE_COLOR.ACCENT }}
            >
              詳しくはこちら
            </Link>
          </Box>
          <Box as="section">
            <Text as="h3" fontSize="20px">使用可能サプリ</Text>
            <Link
              href={`/regulation/${id}/preview/supplement`}
              color={STYLE_COLOR.SECONDARY}
              textDecoration="underline"
              _hover={{ color: STYLE_COLOR.ACCENT }}
            >
              詳しくはこちら
            </Link>
          </Box>
          <Box as="section">
            <Text as="h3" fontSize="20px">信仰可能な神格</Text>
            <Link
              href={`/regulation/${id}/preview/god`}
              color={STYLE_COLOR.SECONDARY}
              textDecoration="underline"
              _hover={{ color: STYLE_COLOR.ACCENT }}
            >
              詳しくはこちら
            </Link>
          </Box>
          <Box as="section">
            <Text as="h3" fontSize="20px">使用可能流派</Text>
            <Link
              href={`/regulation/${id}/preview/school`}
              color={STYLE_COLOR.SECONDARY}
              textDecoration="underline"
              _hover={{ color: STYLE_COLOR.ACCENT }}
            >
              詳しくはこちら
            </Link>
          </Box>
        </SimpleGrid>
      )}
    </AdminLayoutTemplate>
  );
}
