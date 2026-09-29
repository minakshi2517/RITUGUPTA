import { notFound } from "next/navigation";
import { LinkEditor } from "@/components/admin/forms";
import { listLinks } from "@/lib/data";

export default async function EditLinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const link = (await listLinks()).find((item) => item.id === id);
  if (!link) notFound();
  return <LinkEditor link={link} saved={saved === "1"} />;
}
