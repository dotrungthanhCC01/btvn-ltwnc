// ProductCard khi CHƯA tối ưu (không dùng React.memo)
import type { Product } from "../features/products/types/products.type";

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

// Component thường: mỗi lần component cha re-render
// (gõ search, bấm count...) thì function này chạy lại,
// dù props product không hề thay đổi.
// Với 10.000 card => 10.000 lần render lại mỗi lần bấm count.
export default function ProductCardBefore({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="pm-card">
      <div>
        <h3>{product.title}</h3>
        <p>
          ${product.price} · {product.category}
        </p>
      </div>
      <button onClick={() => onAddToCart(product)}>Add to cart</button>
    </div>
  );
}
