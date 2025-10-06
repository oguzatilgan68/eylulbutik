import OrderDetailClient from "./OrderDetailPage";

export default async function OrderDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return <OrderDetailClient id={params.id} />;
}
