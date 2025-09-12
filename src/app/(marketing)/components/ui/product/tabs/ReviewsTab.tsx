import Reviews from "./Reviews";

export default function ReviewsTab({ productId }: { productId: string }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Yorumlar</h3>
      <Reviews productId={productId} />
    </div>
  );
}
