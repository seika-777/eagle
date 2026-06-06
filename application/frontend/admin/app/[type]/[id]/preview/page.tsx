import { notFound } from "next/navigation";
import RegulationPreviewTemplate from "@/component/templates/RegulationPreviewTemplate";

type Props = {
  params: Promise<{ type: string; id: string }>;
};

export default async function PreviewPage({ params }: Props) {
  const { type, id } = await params;
  if (type !== "regulation") notFound();
  return <RegulationPreviewTemplate id={id} />;
}
