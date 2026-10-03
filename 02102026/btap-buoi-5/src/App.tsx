import { lazy, Suspense } from "react";

// Kỹ thuật 3: Code-splitting bằng React.lazy + dynamic import().
// Mỗi phiên bản trang được tách thành một chunk JS riêng,
// chỉ tải khi thực sự được render => bundle chính nhẹ hơn.
// Chọn phiên bản bằng query: /?v=before  hoặc  /?v=after (mặc định: after)
const ProductsPageBefore = lazy(() => import("./before/ProductsPageBefore"));
const ProductsPageAfter = lazy(() => import("./after/ProductsPageAfter"));

export default function App() {
  const version = new URLSearchParams(window.location.search).get("v");
  const Page = version === "before" ? ProductsPageBefore : ProductsPageAfter;

  // Suspense hiển thị fallback trong lúc chunk đang được tải.
  return (
    <Suspense fallback={<p style={{ padding: 24 }}>Loading...</p>}>
      <Page />
    </Suspense>
  );
}
