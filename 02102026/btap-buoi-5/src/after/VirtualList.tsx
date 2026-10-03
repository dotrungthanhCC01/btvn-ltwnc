// Kỹ thuật 2: Virtualization (windowing) - tự viết, không dùng thư viện.
// Ý tưởng: người dùng chỉ nhìn thấy ~8 dòng cùng lúc (khung cao 600px,
// mỗi dòng 72px) nên chỉ cần render các dòng đó (+ overscan),
// phần còn lại thay bằng chiều cao ảo để thanh cuộn vẫn đúng
// -> DOM chỉ ~20 node thay vì 10.000.
import { useCallback, useState, type ReactNode } from "react";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  overscan?: number;
  getKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
}

export default function VirtualList<T>({
  items,
  itemHeight,
  height,
  overscan = 5,
  getKey,
  renderItem,
}: VirtualListProps<T>) {
  // scrollTop = vị trí đã cuộn, dùng để tính dòng nào đang hiển thị.
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const end = Math.min(
    items.length,
    Math.ceil((scrollTop + height) / itemHeight) + overscan,
  );

  return (
    <div className="pm__viewport" style={{ height }} onScroll={onScroll}>
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${start * itemHeight}px)` }}>
          {items.slice(start, end).map((item) => (
            <div key={getKey(item)}>{renderItem(item)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
