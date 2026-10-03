# BÁO CÁO TỐI ƯU HIỆU NĂNG REACTJS – TRANG QUẢN LÝ 10.000 SẢN PHẨM

- Dự án: `btap-buoi-5` (React 19 + Vite + TypeScript)
- Công cụ đo: Lighthouse CLI, hạng mục Performance, thiết lập mặc định (mobile, throttling mô phỏng), Chrome headless
- Môi trường: bản production (`vite build` + `vite preview`, cổng 4173)
- Bằng chứng gốc: `reports/before.report.html|json`, `reports/after.report.html|json`

## 1. Mô tả bài toán
Trang hiển thị 10.000 sản phẩm (`id`, `title`, `price`, `category`) với:
- Ô tìm kiếm theo tên
- Bộ lọc theo danh mục
- Nút `Count` (mô phỏng state không liên quan gây re-render)
- Nút `Add to cart` trên mỗi sản phẩm

Hai phiên bản cùng chức năng, truy cập qua:
- `/?v=before`: chưa tối ưu
- `/?v=after`: đã tối ưu

## 2. Cấu trúc code

```
src/
├─ App.tsx                       # lazy-load 2 phiên bản (code-splitting)
├─ main.tsx
├─ before/
│  ├─ ProductsPageBefore.tsx     # trang chưa tối ưu
│  └─ ProductCardBefore.tsx      # card thường
├─ after/
│  ├─ ProductsPageAfter.tsx      # trang đã tối ưu
│  ├─ ProductCardAfter.tsx       # card bọc React.memo
│  └─ VirtualList.tsx            # virtualization tự viết
├─ features/
│  ├─ products/types/products.type.ts
│  └─ services/data.ts           # sinh 10.000 sản phẩm + danh sách category
└─ styles/products.css
```

## 3. Đo TRƯỚC khi tối ưu

| Chỉ số | Giá trị |
|---|---|
| Performance score | **86** |
| FCP | 1.4 s |
| LCP | 2.0 s |
| TBT | **500 ms** |
| CLS | 0 |
| Speed Index | 2.3 s |
| DOM size | **50.017 phần tử** |

### Vấn đề phát hiện
1. **DOM quá lớn**: `map` toàn bộ 10.000 card -> ~50.000 node. Trình duyệt tốn nhiều thời gian tạo/layout/paint, main thread bị chặn (TBT 500 ms), LCP và Speed Index chậm.
2. **Tính toán lặp lại**: `filter` 10.000 phần tử chạy lại ở mọi lần render, kể cả khi chỉ bấm `Count`.
3. **Re-render thừa**: `handleAddToCart` được tạo lại mỗi lần render và card không được memo -> 10.000 card render lại mỗi lần bấm `Count` hoặc gõ phím.
4. **Gõ search bị giật**: việc lọc và render 10.000 phần tử chạy đồng bộ ngay trong lần gõ phím.
5. **Không tách bundle**: mọi code nằm chung chunk chính.

## 4. Giải pháp đã áp dụng (6 kỹ thuật, ứng với từng vấn đề)

| # | Kỹ thuật | File | Vấn đề giải quyết |
|---|---|---|---|
| 1 | **Virtualization** | `after/VirtualList.tsx` | Vấn đề 1 – chỉ render dòng nhìn thấy |
| 2 | **React.memo** | `after/ProductCardAfter.tsx` | Vấn đề 3 – card không render lại khi props không đổi |
| 3 | **useCallback** | `ProductsPageAfter.tsx` | Vấn đề 3 – giữ reference `handleAddToCart`, `renderItem` để memo có hiệu lực |
| 4 | **useMemo** | `ProductsPageAfter.tsx` | Vấn đề 2 – chỉ lọc lại khi `search`/`category` đổi |
| 5 | **useDeferredValue** | `ProductsPageAfter.tsx` | Vấn đề 4 – ô input luôn phản hồi ngay |
| 6 | **Code-splitting** (`React.lazy` + `Suspense`) | `App.tsx` | Vấn đề 5 – mỗi trang là một chunk riêng |

### 4.1 Virtualization (kỹ thuật chính)
Khung cuộn cao 600px, mỗi dòng 72px nên chỉ thấy ~8 dòng. Thay vì render 10.000 dòng:
```
start = max(0, floor(scrollTop / itemHeight) - overscan)
end   = min(total, ceil((scrollTop + height) / itemHeight) + overscan)
```
- Một thẻ `div` có chiều cao `total * itemHeight` giữ thanh cuộn đúng.
- Chỉ `items.slice(start, end)` được render, đặt vị trí bằng `translateY(start * itemHeight)`.
- Kết quả: **DOM 50.017 -> 103 phần tử**.

### 4.2 React.memo + useCallback
`React.memo` bỏ qua render khi props giữ nguyên. Nhưng nếu cha truyền function mới mỗi lần render thì memo vô tác dụng, nên cần `useCallback` để giữ reference ổn định.

### 4.3 useMemo
```tsx
const filteredProducts = useMemo(() => products.filter(...), [deferredSearch, category]);
```
Gộp hai lần `filter` thành một lần duyệt mảng; bấm `Count` dùng lại kết quả cũ.

### 4.4 useDeferredValue
`search` cập nhật ngay cho ô input, còn `deferredSearch` (ưu tiên thấp) dùng cho việc lọc, nên gõ phím không bị giật.

### 4.5 Code-splitting
`App.tsx` dùng `lazy(() => import(...))`. Kết quả build:

| Chunk | Kích thước | Gzip |
|---|---|---|
| `index` (React + app shell) | 221.57 kB | 69.42 kB |
| `ProductsPageBefore` | 1.47 kB | 0.69 kB |
| `ProductsPageAfter` | 2.14 kB | 0.97 kB |

Mỗi phiên bản chỉ tải chunk của mình.

## 5. Đo SAU khi tối ưu và so sánh

| Chỉ số | Trước | Sau | Thay đổi |
|---|---|---|---|
| Performance score | 86 | **99** | +13 điểm |
| FCP | 1.4 s | 1.4 s | không đổi |
| LCP | 2.0 s | 1.7 s | giảm 0.3 s (~15%) |
| TBT | 500 ms | **0 ms** | giảm 100% |
| CLS | 0 | 0.009 | tăng không đáng kể (ngưỡng tốt < 0.1) |
| Speed Index | 2.3 s | 1.4 s | giảm 0.9 s (~39%) |
| DOM size | 50.017 | **103** | giảm 99.8% |

## 6. Phân tích kết quả
- **TBT 500 ms -> 0 ms, DOM -99.8%**: đến từ virtualization. Main thread không còn bị chặn bởi việc tạo hàng chục nghìn node.
- **LCP và Speed Index giảm**: trang vẽ nội dung nhanh hơn vì trình duyệt chỉ layout/paint ~100 node.
- **FCP không đổi (1.4 s)**: FCP bị chi phối bởi việc tải và chạy bundle React (~69 kB gzip) và HTML khung, hai bản giống nhau. Muốn giảm thêm cần giảm kích thước bundle chính.
- **CLS 0 -> 0.009**: do chuyển sang khung cuộn cố định. Mức này vẫn thuộc "Good".
- **memo/useCallback/useMemo/useDeferredValue** không thể hiện nhiều trong điểm Lighthouse (chỉ đo lúc tải trang) nhưng cải thiện **khả năng tương tác**: bấm `Count` không còn render lại card, gõ search mượt hơn. Có thể kiểm chứng bằng React DevTools Profiler hoặc `console.log` trong card.
- **Code-splitting** có lợi ích thật khi ứng dụng có nhiều trang, ở đây chỉ có một trang nên tác động đo được nhỏ.

## 7. Hạn chế
- Mỗi phiên bản chỉ đo 1 lần; Lighthouse dao động giữa các lần chạy, nên chạy 3–5 lần và lấy trung vị để chắc chắn hơn.
- Dữ liệu sinh ngẫu nhiên tại client, không có độ trễ mạng như API thật.
- `VirtualList` tự viết giả định chiều cao dòng cố định (72px). Với dòng chiều cao thay đổi nên dùng thư viện như `react-window` hoặc `@tanstack/react-virtual`.

## 8. Cách chạy lại
```bash
npm install
npm run build
npm run preview -- --port 4173
npx lighthouse "http://localhost:4173/?v=before" --only-categories=performance --output=html --output-path=./reports/before
npx lighthouse "http://localhost:4173/?v=after"  --only-categories=performance --output=html --output-path=./reports/after
```

## 9. Kết luận
Kết hợp virtualization, memoization, `useDeferredValue` và code-splitting đưa điểm Performance từ **86 lên 99**, TBT từ **500 ms về 0** và DOM từ **50.017 xuống 103 phần tử**. Với danh sách lớn, giảm số node render là tối ưu hiệu quả nhất; memoization giữ cho tương tác sau đó mượt.
