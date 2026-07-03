import { getOptions } from "@/const/function/getOptions";
import { METADATA } from "@/const/common/METADATA";

type MetadataPageKey = keyof ReturnType<typeof METADATA>["TITLE"];

export const getPageMetadata = async (
  key: MetadataPageKey,
  titleSuffix = ""
): Promise<{ title: string; description: string }> => {
  const options = await getOptions();
  const metadata = METADATA(options.siteName);
  return {
    title: `${options.siteName}|${metadata.TITLE[key]}${titleSuffix}`,
    description: metadata.DESCRIPTION[key],
  };
};
