"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Text, Link, Spinner } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getRaceItems } from "@/const/function/getRaceItems";
import { getGodItems } from "@/const/function/getGodItems";
import { getSchoolItems } from "@/const/function/getSchoolItems";
import { ORIGINAL_PAGE } from "@/const/pages/ORIGINAL_PAGE";
import { RACE } from "@/const/common/RACE";
import type { RaceItemType } from "@/const/type/race/RaceItemType";
import type { RaceListType } from "@/const/type/race/RaceListType";
import type { GodItemType } from "@/const/type/god/GodItemType";
import type { SchoolItemType } from "@/const/type/school/SchoolItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

export default function OriginalList() {
  const [raceItems, setRaceItems] = useState<RaceItemType[]>([]);
  const [godItems, setGodItems] = useState<GodItemType[]>([]);
  const [schoolItems, setSchoolItems] = useState<SchoolItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, resetError } = useErrorHandler();

  useEffect(() => {
    setLoading(true);
    resetError();
    const fetchData = async () => {
      try {
        const [raceData, godData, schoolData] = await Promise.all([
          getRaceItems(),
          getGodItems(),
          getSchoolItems(),
        ]);
        setRaceItems(raceData);
        setGodItems(godData);
        setSchoolItems(schoolData);
        setLoading(false);
      } catch (error) {
        handleError(error as ErrorType);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const originalRaceItems = useMemo(() => raceItems.filter((item) => item.isOriginal), [raceItems]);
  const originalGodItems = useMemo(() => godItems.filter((item) => item.isOriginal), [godItems]);
  const originalSchoolItems = useMemo(() => schoolItems.filter((item) => item.isOriginal), [schoolItems]);

  const RaceItem = ({ item }: { item: RaceItemType }) => {
    return (
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
            {item.name}({item.raceType.map((rt) => RACE.TEXT[rt.name as RaceListType]).join("/")})
          </Link>
        ) : (
          <Text>{item.name}</Text>
        )}
      </Box>
    );
  };

  const GodItem = ({ item }: { item: GodItemType }) => {
    return (
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
  };

  const SchoolItem = ({ item }: { item: SchoolItemType }) => {
    return (
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
  };

  return (
    <Box as="section" textAlign="left" width="100%">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {originalRaceItems.length > 0 && (
            <Box mb={8}>
              <HeadingSecond title={ORIGINAL_PAGE.TEXT.raceHeading} />
              <Box as="ul" listStyleType="none" p={0} mt={2}>
                {originalRaceItems.map((item) => (
                  <RaceItem key={item.id} item={item} />
                ))}
              </Box>
            </Box>
          )}
          {originalGodItems.length > 0 && (
            <Box mb={8}>
              <HeadingSecond title={ORIGINAL_PAGE.TEXT.godHeading} />
              <Box as="ul" listStyleType="none" p={0} mt={2}>
                {originalGodItems.map((item) => (
                  <GodItem key={item.id} item={item} />
                ))}
              </Box>
            </Box>
          )}
          {originalSchoolItems.length > 0 && (
            <Box mb={8}>
              <HeadingSecond title={ORIGINAL_PAGE.TEXT.schoolHeading} />
              <Box as="ul" listStyleType="none" p={0} mt={2}>
                {originalSchoolItems.map((item) => (
                  <SchoolItem key={item.id} item={item} />
                ))}
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
