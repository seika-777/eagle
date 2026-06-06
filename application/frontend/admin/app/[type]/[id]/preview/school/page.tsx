import { notFound } from "next/navigation";
import RegulationPreviewSchoolTemplate from "@/component/templates/RegulationPreviewSchoolTemplate";

type Props = {
  params: Promise<{ type: string; id: string }>;
};

export default async function PreviewSchoolPage({ params }: Props) {
  const { type } = await params;
  if (type !== "regulation") notFound();
  return <RegulationPreviewSchoolTemplate />;
}
