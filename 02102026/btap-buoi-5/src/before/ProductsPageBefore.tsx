// ProductsPage khi CHƯA tối ưu
import { useState } from "react";
import type { Product } from "../features/products/types/products.type";
import { products, categories } from "../features/services/data";
import ProductCardBefore from "./ProductCardBefore";
import "../styles/products.css";

export default function ProductsPageBefore() {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Vấn đề 1: Mỗi lần ProductsPage re-render, function này
  // được tạo lại với một reference mới => card nhận props mới.
  const handleAddToCart = (product: Product) => {
    console.log("Add:", product.id);
  };

  // Vấn đề 2: Component re-render → function component chạy lại
  // → các câu lệnh khai báo biến bên trong được thực thi lại
  // → lọc 10.000 sản phẩm bị tính lại mỗi lần,
  // kể cả khi chỉ bấm nút count (search/category không đổi).
  const filteredProducts = products
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (category === "all" ? true : p.category === category));

  return (
    <main className="pm">
      <h1>Product Manager (BEFORE)</h1>
      <p className="pm__sub">Render toàn bộ danh sách, không tối ưu.</p>
      <div className="pm__toolbar">
        <input
          type="text"
          aria-label="Search products"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      </div>
      <p className="pm__meta">{filteredProducts.length} products</p>
      {/* Vấn đề 3: map toàn bộ 10.000 phần tử vào DOM
          => ~50.000 node, main thread bị chặn lâu (TBT cao, LCP chậm). */}
      <div className="pm__list">
        {filteredProducts.map((product) => (
          <ProductCardBefore
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </main>
  );
}
