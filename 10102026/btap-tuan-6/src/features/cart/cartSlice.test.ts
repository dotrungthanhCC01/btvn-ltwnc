import { describe, it, expect } from "vitest";
import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from "./cartSlice";
import type { CartState } from "./cartType";
import type { CartItem } from "./cartType";

// ─── Factory ────────────────────────────────────────────────────────────────
function makeItem(partial: Partial<CartItem> & { id: number }): CartItem {
  return {
    title: "Sản phẩm mẫu",
    price: 100_000,
    image: "https://example.com/img.jpg",
    quantity: 1,
    ...partial,
  };
}

const emptyState: CartState = { items: [] };

// ─── NHÓM A – Unit test: cartReducer ────────────────────────────────────────
describe("cartReducer", () => {
  // TC-07
  it("trả về state ban đầu là giỏ rỗng", () => {
    // Act: gọi reducer với state undefined (trạng thái khởi tạo)
    const state = cartReducer(undefined, { type: "@@INIT" });
    // Assert
    expect(state.items).toHaveLength(0);
  });

  // TC-08
  it("addItem: thêm sản phẩm mới vào giỏ hàng rỗng với quantity = 1", () => {
    // Arrange
    const product = makeItem({ id: 1, title: "Áo thun", price: 200_000 });
    // Act
    const newState = cartReducer(emptyState, addItem(product));
    // Assert
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0]).toEqual({ ...product, quantity: 1 });
  });

  // TC-09
  it("addItem: tăng quantity khi thêm sản phẩm đã có trong giỏ", () => {
    // Arrange: giỏ đã có 1 sản phẩm với quantity 2
    const initialState: CartState = {
      items: [makeItem({ id: 1, quantity: 2 })],
    };
    const product = makeItem({ id: 1 });
    // Act
    const newState = cartReducer(initialState, addItem(product));
    // Assert: quantity tăng lên 3, không thêm item mới
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].quantity).toBe(3);
  });

  // TC-10
  it("removeItem: xóa đúng sản phẩm theo id", () => {
    // Arrange
    const initialState: CartState = {
      items: [makeItem({ id: 1 }), makeItem({ id: 2, title: "Quần jean" })],
    };
    // Act
    const newState = cartReducer(initialState, removeItem(1));
    // Assert
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].id).toBe(2);
  });

  // TC-11 – Trường hợp biên
  it("removeItem: không thay đổi state khi xóa id không tồn tại", () => {
    // Arrange
    const initialState: CartState = {
      items: [makeItem({ id: 1 })],
    };
    // Act
    const newState = cartReducer(initialState, removeItem(999));
    // Assert: vẫn còn 1 item
    expect(newState.items).toHaveLength(1);
  });

  // TC-12
  it("updateQuantity: cập nhật đúng số lượng sản phẩm theo id", () => {
    // Arrange
    const initialState: CartState = {
      items: [makeItem({ id: 1, quantity: 1 })],
    };
    // Act
    const newState = cartReducer(
      initialState,
      updateQuantity({ id: 1, quantity: 5 }),
    );
    // Assert
    expect(newState.items[0].quantity).toBe(5);
  });

  // TC-13 – Trường hợp biên
  it("updateQuantity: không thay đổi state khi id không tồn tại", () => {
    // Arrange
    const initialState: CartState = {
      items: [makeItem({ id: 1, quantity: 3 })],
    };
    // Act
    const newState = cartReducer(
      initialState,
      updateQuantity({ id: 999, quantity: 10 }),
    );
    // Assert: quantity không thay đổi
    expect(newState.items[0].quantity).toBe(3);
  });

  // TC-14
  it("clearCart: xóa toàn bộ sản phẩm khỏi giỏ hàng", () => {
    // Arrange
    const initialState: CartState = {
      items: [makeItem({ id: 1 }), makeItem({ id: 2 })],
    };
    // Act
    const newState = cartReducer(initialState, clearCart());
    // Assert
    expect(newState.items).toHaveLength(0);
  });
});
