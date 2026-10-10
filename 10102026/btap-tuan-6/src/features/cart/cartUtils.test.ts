import { describe, it, expect } from "vitest";
import { calculateTotal, calculateTotalQuantity } from "./cartUtils";
import type { CartItem } from "./cartType";

// ─── Factory helper ─────────────────────────────────────────────────────────
function makeItem(partial: Partial<CartItem> & { id: number }): CartItem {
  return {
    title: "Sản phẩm mẫu",
    price: 100_000,
    image: "https://example.com/img.jpg",
    quantity: 1,
    ...partial,
  };
}

// ─── NHÓM A – Unit test: calculateTotal ─────────────────────────────────────
describe("calculateTotal", () => {
  // TC-01
  it("trả về 0 khi giỏ hàng rỗng", () => {
    // Arrange
    const items: CartItem[] = [];
    // Act
    const result = calculateTotal(items);
    // Assert
    expect(result).toBe(0);
  });

  // TC-02
  it("tính đúng tổng tiền với một sản phẩm, số lượng 1", () => {
    // Arrange
    const items = [makeItem({ id: 1, price: 50_000, quantity: 1 })];
    // Act
    const result = calculateTotal(items);
    // Assert
    expect(result).toBe(50_000);
  });

  // TC-03
  it("tính đúng tổng tiền với một sản phẩm, số lượng nhiều", () => {
    // Arrange
    const items = [makeItem({ id: 1, price: 30_000, quantity: 3 })];
    // Act
    const result = calculateTotal(items);
    // Assert
    expect(result).toBe(90_000);
  });

  // TC-04
  it("tính đúng tổng tiền với nhiều sản phẩm và số lượng khác nhau", () => {
    // Arrange
    const items = [
      makeItem({ id: 1, price: 10_000, quantity: 2 }),  // 20 000
      makeItem({ id: 2, price: 25_000, quantity: 3 }),  // 75 000
      makeItem({ id: 3, price: 100_000, quantity: 1 }), // 100 000
    ];
    // Act
    const result = calculateTotal(items);
    // Assert
    expect(result).toBe(195_000);
  });
});

// ─── NHÓM A – Unit test: calculateTotalQuantity ─────────────────────────────
describe("calculateTotalQuantity", () => {
  // TC-05
  it("trả về 0 khi giỏ hàng rỗng", () => {
    expect(calculateTotalQuantity([])).toBe(0);
  });

  // TC-06
  it("tính đúng tổng số lượng với nhiều sản phẩm", () => {
    const items = [
      makeItem({ id: 1, quantity: 2 }),
      makeItem({ id: 2, quantity: 5 }),
    ];
    expect(calculateTotalQuantity(items)).toBe(7);
  });
});
