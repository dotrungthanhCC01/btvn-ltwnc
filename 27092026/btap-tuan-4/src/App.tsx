import { useEffect } from "react";

import { ProductCard } from "./features/products/components/ProductCard";
import { FavoriteList } from "../src/features/favourites/components/FavoriteList";

import { useProductsStore } from "./features/products/productsStore";

function App() {
  const products = useProductsStore((state) => state.products);

  const loading = useProductsStore((state) => state.loading);

  const error = useProductsStore((state) => state.error);

  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="app">
      <main className="container">
        <FavoriteList />

        <section className="products-section">
          <div className="section-header">
            <div>
              <h2>🛍️ Danh sách sản phẩm</h2>

              <p>Bấm ❤️ để thêm hoặc xóa sản phẩm yêu thích.</p>
            </div>

            <span className="product-count">{products.length} sản phẩm</span>
          </div>

          {loading && <div className="message">Đang tải sản phẩm...</div>}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
