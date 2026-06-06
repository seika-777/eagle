"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Text, Link, Spinner } from "@chakra-ui/react";
import { useStateMachine } from "little-state-machine";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getItems } from "@/const/function/getItems";
import { updateStore } from "@/const/store/previewStore";
import { GOD } from "@/const/common/GOD";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

type GodItem = {
  id: number;
  type: number;
  name: string;
  url: string;
  is_always: boolean;
};

export default function RegulationPreviewGodTemplate() {
  const { state } = useStateMachine({ actions: { updateStore } });
  const form = state.preview.regulationPreview?.form;
  const selectedIds = (form?.godIds ?? []) as number[];

  const [allItems, setAllItems] = useState<GodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, handleError } = useErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getItems<GodItem>("god");
        setAllItems(data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const items = useMemo(
    () => allItems.filter((item) => item.is_always || selectedIds.includes(item.id)),
    [allItems, selectedIds],
  );

  const originalItems = useMemo(() => items.filter((item) => item.url), [items]);

  const groupedByType = useMemo(() => {
    const groups: Record<number, GodItem[]> = {};
    items
      .filter((item) => !item.url)
      .forEach((item) => {
        if (!groups[item.type]) groups[item.type] = [];
        groups[item.type].push(item);
      });
    return groups;
  }, [items]);

  const GodItem = ({ item }: { item: GodItem }) => (
    <Box as="li" py={1}>
      {item.url ? (
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          color={STYLE_COLOR.SECONDARY}
          textDecoration="underline"
          _hover={{ color: STYLE_COLOR.ACCENT }}
        >
          {item.name}
        </Link>
      ) : (
        <Text>{item.name}</Text>
      )}
    </Box>
  );

  return (
    <AdminLayoutTemplate title="プレビュー - 信仰可能な神格">
      <Box as="section" textAlign="left" width="100%">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {error && <Text color={STYLE_COLOR.ERROR}>{error}</Text>}
            {GOD.TYPE_ORDER.filter((type) => groupedByType[type]).map((type) => (
              <Box key={type} mb={6}>
                <Text as="h3" fontSize="20px">{GOD.TYPE_TEXT[type]}</Text>
                <Box as="ul" listStyleType="none" p={0} mt={2}>
                  {groupedByType[type].map((item) => (
                    <GodItem key={item.id} item={item} />
                  ))}
                </Box>
              </Box>
            ))}
            {originalItems.length > 0 && (
              <Box mb={6}>
                <Text as="h3" fontSize="20px">オリジナル信仰</Text>
                <Box as="ul" listStyleType="none" p={0} mt={2}>
                  {originalItems.map((item) => (
                    <GodItem key={item.id} item={item} />
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </AdminLayoutTemplate>
  );
}
