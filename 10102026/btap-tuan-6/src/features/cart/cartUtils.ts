import type { CartItem } from "./cartType";

/**
 * Tính tổng tiền của giỏ hàng.
 * @param items - Danh sách sản phẩm trong giỏ
 * @returns Tổng tiền (số)
 */
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Tính tổng số lượng sản phẩm trong giỏ hàng.
 * @param items - Danh sách sản phẩm trong giỏ
 * @returns Tổng số lượng
 */
export function calculateTotalQuantity(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}
