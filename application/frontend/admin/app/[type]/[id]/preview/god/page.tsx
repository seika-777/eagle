import { notFound } from "next/navigation";
import RegulationPreviewGodTemplate from "@/component/templates/RegulationPreviewGodTemplate";

type Props = {
  params: Promise<{ type: string; id: string }>;
};

export default async function PreviewGodPage({ params }: Props) {
  const { type } = await params;
  if (type !== "regulation") notFound();
  return <RegulationPreviewGodTemplate />;
}
