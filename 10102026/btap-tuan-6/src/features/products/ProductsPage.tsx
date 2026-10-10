import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { fetchProducts } from "./productSlice";
import { addItem } from "../cart/cartSlice";

export default function ProductList() {
  const dispatch = useAppDispatch();

  const { items, status, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <p role="status">Đang tải sản phẩm...</p>;
  }

  if (status === "failed") {
    return <p role="alert">Lỗi: {error}</p>;
  }

  return (
    <section aria-label="Danh sách sản phẩm">
      <h2>Danh sách sản phẩm</h2>

      <div className="product-grid">
        {items.map((product) => (
          <article key={product.id} aria-label={product.title}>
            <img src={product.image} alt={product.title} width={150} />

            <h3>{product.title}</h3>

            <p>{product.price.toLocaleString()} VNĐ</p>

            <button
              aria-label={`Thêm ${product.title} vào giỏ`}
              onClick={() =>
                dispatch(
                  addItem({
                    ...product,
                    quantity: 1,
                  }),
                )
              }
            >
              Thêm vào giỏ
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
