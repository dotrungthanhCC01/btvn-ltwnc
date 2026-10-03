// ProductsPage SAU khi tối ưu
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import type { Product } from "../features/products/types/products.type";
import { products, categories } from "../features/services/data";
import ProductCardAfter from "./ProductCardAfter";
import VirtualList from "./VirtualList";
import "../styles/products.css";

const ROW_HEIGHT = 72; // phải khớp với height của .pm-card trong CSS

export default function ProductsPageAfter() {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // useDeferredValue: ô input cập nhật ngay (ưu tiên cao),
  // còn việc lọc 10.000 sản phẩm dùng giá trị "trễ" (ưu tiên thấp)
  // nên gõ phím không bị giật.
  const deferredSearch = useDeferredValue(search);

  // useCallback giúp giữ reference của function handleAddToCart
  // không đổi khi ProductsPage re-render
  // => ProductCardAfter (React.memo) không render lại khi bấm count.
  const handleAddToCart = useCallback((product: Product) => {
    console.log("Add:", product.id);
  }, []);

  // useMemo: lọc 10.000 sản phẩm là phép tính tốn chi phí.
  // Kết quả được lưu lại và chỉ tính lại khi search hoặc category đổi.
  // Bấm count => dùng lại kết quả cũ.
  // Gộp 2 điều kiện vào 1 lần filter thay vì 2 lần duyệt mảng.
  const filteredProducts = useMemo(() => {
    const keyword = deferredSearch.toLowerCase();
    return products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        p.title.toLowerCase().includes(keyword),
    );
  }, [deferredSearch, category]);

  // renderItem cũng cần ổn định reference để VirtualList không tạo lại vô ích.
  const renderItem = useCallback(
    (product: Product) => (
      <ProductCardAfter product={product} onAddToCart={handleAddToCart} />
    ),
    [handleAddToCart],
  );

  return (
    <main className="pm">
      <h1>Product Manager (AFTER)</h1>
      <p className="pm__sub">Virtualization + memoization + code-splitting.</p>
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
      {/* Virtualization: chỉ render ~20 dòng đang nhìn thấy
          thay vì 10.000 => DOM từ ~50.000 node xuống ~100 node. */}
      <VirtualList
        items={filteredProducts}
        itemHeight={ROW_HEIGHT}
        height={600}
        getKey={(p) => p.id}
        renderItem={renderItem}
      />
    </main>
  );
}
