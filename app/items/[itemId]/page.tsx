import { ItemDetailsPage } from "@/src/views";

interface ItemDetailsRouteProps {
  params: Promise<{
    itemId: string;
  }>;
}

export default async function ItemDetailsRoute({
  params,
}: ItemDetailsRouteProps) {
  const { itemId } = await params;

  return <ItemDetailsPage itemId={itemId} />;
}
