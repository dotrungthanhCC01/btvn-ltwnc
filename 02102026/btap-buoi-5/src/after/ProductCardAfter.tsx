// Kỹ thuật 1: React.memo
import { memo } from "react";
import type { ProductCardProps } from "../before/ProductCardBefore";

// React.memo giúp ProductCard bỏ qua re-render
// khi các props vẫn giữ nguyên reference/value.
// Tuy nhiên, memo không đảm bảo component luôn tránh render:
// nếu cha truyền function mới mỗi lần render (không useCallback)
// thì reference đổi => memo vô tác dụng.
// Vì vậy ProductsPageAfter dùng useCallback cho onAddToCart.
const ProductCardAfter = memo(function ProductCardAfter({
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
});

export default ProductCardAfter;
