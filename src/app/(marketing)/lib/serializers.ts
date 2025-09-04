export function serializeProduct(product: any) {
  return {
    ...product,
    price: product.price ? product.price.toString() : null, // 👈 Decimal → string
  };
}
