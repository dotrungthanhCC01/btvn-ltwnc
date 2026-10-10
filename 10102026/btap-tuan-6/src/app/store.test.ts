import { describe, it, expect } from "vitest";
import { store } from "./store";
import { addItem } from "../features/cart/cartSlice";

describe("Redux App Store", () => {
  it("khởi tạo store với state mặc định", () => {
    const state = store.getState();
    expect(state.cart.items).toEqual([]);
    expect(state.products.items).toEqual([]);
    expect(state.products.status).toBe("idle");
  });

  it("dispatch action cập nhật state trong store", () => {
    store.dispatch(
      addItem({
        id: 999,
        title: "Sản phẩm test store",
        price: 50_000,
        image: "https://example.com/test.jpg",
        quantity: 1,
      }),
    );
    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0].title).toBe("Sản phẩm test store");
  });
});
