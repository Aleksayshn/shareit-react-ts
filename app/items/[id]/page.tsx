import { ItemDetailsPage } from "@/src/views";

interface ItemDetailsRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ItemDetailsRoute({
  params,
}: ItemDetailsRouteProps) {
  const { id } = await params;

  return <ItemDetailsPage itemId={id} />;
}
