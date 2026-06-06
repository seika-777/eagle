"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Text, Link, Spinner } from "@chakra-ui/react";
import { useStateMachine } from "little-state-machine";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getItems } from "@/const/function/getItems";
import { updateStore } from "@/const/store/previewStore";
import { RACE } from "@/const/common/RACE";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import type { RaceListType } from "@/const/type/race/RaceListType";

type RaceItem = {
  id: number;
  name: string;
  race_type: string[];
  url: string;
  is_always: boolean;
};

type RaceGroup = {
  label: string;
  items: RaceItem[];
};

export default function RegulationPreviewRaceTemplate() {
  const { state } = useStateMachine({ actions: { updateStore } });
  const form = state.preview.regulationPreview?.form;
  const selectedIds = (form?.raceIds ?? []) as number[];

  const [allItems, setAllItems] = useState<RaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, handleError } = useErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getItems<RaceItem>("race");
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

  const groupByRaceType = (items: RaceItem[]): Record<string, RaceGroup> => {
    return items.reduce<Record<string, RaceGroup>>((acc, item) => {
      item.race_type.forEach((rt) => {
        if (!acc[rt]) {
          acc[rt] = {
            label: rt in RACE.TEXT ? RACE.TEXT[rt as RaceListType] : rt,
            items: [],
          };
        }
        acc[rt].items.push(item);
      });
      return acc;
    }, {});
  };

  const originalItems = useMemo(() => items.filter((item) => item.url), [items]);
  const groupedByRaceType = useMemo(() => groupByRaceType(items.filter((item) => !item.url)), [items]);

  const RaceItem = ({ item }: { item: RaceItem }) => (
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
          {item.name}({item.race_type.map((rt) => RACE.TEXT[rt as RaceListType] ?? rt).join("/")})
        </Link>
      ) : (
        <Text>{item.name}</Text>
      )}
    </Box>
  );

  return (
    <AdminLayoutTemplate title="プレビュー - 使用可能種族">
      <Box as="section" textAlign="left" width="100%">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {error && <Text color={STYLE_COLOR.ERROR}>{error}</Text>}
            {Object.entries(groupedByRaceType).map(([key, group]) => (
              <Box key={key} mb={6}>
                <Text as="h3" fontSize="20px">{group.label}</Text>
                <Box as="ul" listStyleType="none" p={0} mt={2}>
                  {group.items.map((item) => (
                    <RaceItem key={item.id} item={item} />
                  ))}
                </Box>
              </Box>
            ))}
            {originalItems.length > 0 && (
              <Box mb={6}>
                <Text as="h3" fontSize="20px">オリジナル種族</Text>
                <Box as="ul" listStyleType="none" p={0} mt={2}>
                  {originalItems.map((item) => (
                    <RaceItem key={item.id} item={item} />
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
