import { notFound } from "next/navigation";
import RegulationPreviewRaceTemplate from "@/component/templates/RegulationPreviewRaceTemplate";

type Props = {
  params: Promise<{ type: string; id: string }>;
};

export default async function PreviewRacePage({ params }: Props) {
  const { type } = await params;
  if (type !== "regulation") notFound();
  return <RegulationPreviewRaceTemplate />;
}
