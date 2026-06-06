import { notFound } from "next/navigation";
import RegulationPreviewSupplementTemplate from "@/component/templates/RegulationPreviewSupplementTemplate";

type Props = {
  params: Promise<{ type: string; id: string }>;
};

export default async function PreviewSupplementPage({ params }: Props) {
  const { type } = await params;
  if (type !== "regulation") notFound();
  return <RegulationPreviewSupplementTemplate />;
}
