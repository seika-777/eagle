"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Text, Link, Spinner } from "@chakra-ui/react";
import { useStateMachine } from "little-state-machine";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getItems } from "@/const/function/getItems";
import { updateStore } from "@/const/store/previewStore";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

type SchoolItem = {
  id: number;
  name: string;
  url: string;
  is_always: boolean;
};

export default function RegulationPreviewSchoolTemplate() {
  const { state } = useStateMachine({ actions: { updateStore } });
  const form = state.preview.regulationPreview?.form;
  const selectedIds = (form?.schoolIds ?? []) as number[];

  const [allItems, setAllItems] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, handleError } = useErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getItems<SchoolItem>("school");
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

  const standardItems = useMemo(() => items.filter((item) => !item.url), [items]);
  const originalItems = useMemo(() => items.filter((item) => item.url), [items]);

  const SchoolItem = ({ item }: { item: SchoolItem }) => (
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
    <AdminLayoutTemplate title="プレビュー - 使用可能流派">
      <Box as="section" textAlign="left" width="100%">
        <Text as="h2" fontSize="30px">使用可能流派</Text>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {error && <Text color={STYLE_COLOR.ERROR}>{error}</Text>}
            <Box as="ul" listStyleType="none" p={0} mt={2}>
              {standardItems.map((item) => (
                <SchoolItem key={item.id} item={item} />
              ))}
            </Box>
            {originalItems.length > 0 && (
              <Box mt={6}>
                <Text as="h2" fontSize="30px">オリジナル流派</Text>
                <Box as="ul" listStyleType="none" p={0} mt={2}>
                  {originalItems.map((item) => (
                    <SchoolItem key={item.id} item={item} />
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
