"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Text, SimpleGrid, Spinner } from "@chakra-ui/react";
import { useStateMachine } from "little-state-machine";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getItems } from "@/const/function/getItems";
import { updateStore } from "@/const/store/previewStore";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

type SupplementItem = {
  id: number;
  name: string;
  is_always: boolean;
};

export default function RegulationPreviewSupplementTemplate() {
  const { state } = useStateMachine({ actions: { updateStore } });
  const form = state.preview.regulationPreview?.form;
  const selectedIds = (form?.supplementIds ?? []) as number[];

  const [allItems, setAllItems] = useState<SupplementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, handleError } = useErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getItems<SupplementItem>("supplement");
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

  return (
    <AdminLayoutTemplate title="プレビュー - 使用可能サプリ">
      <Box as="section" textAlign="left" width="100%">
        <Text as="h2" fontSize="30px">使用サプリメント</Text>
        {loading ? (
          <Spinner />
        ) : (
          <SimpleGrid gap={6}>
            {error && <Text color={STYLE_COLOR.ERROR}>{error}</Text>}
            <Box as="ul" listStyleType="none" p={0} mt={2}>
              {items.map((item) => (
                <Box as="li" key={item.id} py={1}>
                  <Text>{item.name}</Text>
                </Box>
              ))}
            </Box>
          </SimpleGrid>
        )}
      </Box>
    </AdminLayoutTemplate>
  );
}
