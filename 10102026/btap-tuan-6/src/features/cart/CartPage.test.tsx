import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "../../test/renderWithProviders";
import CartPage from "./CartPage";
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

afterEach(() => {
  vi.clearAllMocks();
});

// ─── NHÓM B – Integration test: CartPage ────────────────────────────────────
describe("CartPage – integration", () => {
  // TC-15
  it("hiển thị thông báo giỏ hàng trống khi không có sản phẩm", () => {
    // Arrange & Act
    renderWithProviders(<CartPage />, {
      preloadedState: { cart: { items: [] } },
    });
    // Assert
    expect(screen.getByText("Giỏ hàng đang trống.")).toBeInTheDocument();
  });

  // TC-16
  it("hiển thị đúng tên, giá và số lượng sản phẩm trong giỏ", () => {
    // Arrange
    const item = makeItem({ id: 1, title: "Áo thun", price: 200_000, quantity: 2 });
    // Act
    renderWithProviders(<CartPage />, {
      preloadedState: { cart: { items: [item] } },
    });
    // Assert
    expect(screen.getByText("Áo thun")).toBeInTheDocument();
    expect(screen.getByText(/200\.000/)).toBeInTheDocument();
    expect(screen.getByText(/Số lượng: 2/)).toBeInTheDocument();
  });

  // TC-17
  it("hiển thị đúng tổng tiền và tổng số lượng", () => {
    // Arrange: 2 items
    const items = [
      makeItem({ id: 1, price: 100_000, quantity: 2 }), // 200 000
      makeItem({ id: 2, title: "Quần", price: 50_000, quantity: 3 }),  // 150 000
    ];
    // Act
    renderWithProviders(<CartPage />, {
      preloadedState: { cart: { items } },
    });
    // Assert: tổng số lượng = 5, tổng tiền = 350 000
    expect(screen.getByText(/Tổng số lượng: 5/)).toBeInTheDocument();
    expect(screen.getByText(/Tổng tiền:.*350\.000/)).toBeInTheDocument();
  });

  // TC-18
  it("nút '-' bị vô hiệu hóa khi số lượng sản phẩm là 1", () => {
    // Arrange
    const item = makeItem({ id: 1, title: "Áo", quantity: 1 });
    // Act
    renderWithProviders(<CartPage />, {
      preloadedState: { cart: { items: [item] } },
    });
    // Assert
    const decreaseBtn = screen.getByRole("button", {
      name: /Giảm số lượng Áo/i,
    });
    expect(decreaseBtn).toBeDisabled();
  });

  // TC-19
  it("click '+' tăng số lượng sản phẩm lên 1", async () => {
    // Arrange
    const user = userEvent.setup();
    const item = makeItem({ id: 1, title: "Áo", quantity: 2 });
    renderWithProviders(<CartPage />, {
      preloadedState: { cart: { items: [item] } },
    });
    // Act
    const increaseBtn = screen.getByRole("button", {
      name: /Tăng số lượng Áo/i,
    });
    await user.click(increaseBtn);
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Số lượng: 3/)).toBeInTheDocument();
    });
  });

  // TC-19b
  it("click '-' giảm số lượng sản phẩm khi số lượng > 1", async () => {
    // Arrange
    const user = userEvent.setup();
    const item = makeItem({ id: 1, title: "Áo", quantity: 2 });
    renderWithProviders(<CartPage />, {
      preloadedState: { cart: { items: [item] } },
    });
    // Act
    const decreaseBtn = screen.getByRole("button", {
      name: /Giảm số lượng Áo/i,
    });
    await user.click(decreaseBtn);
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Số lượng: 1/)).toBeInTheDocument();
    });
  });

  // TC-20
  it("click 'Xóa' loại bỏ sản phẩm khỏi danh sách", async () => {
    // Arrange
    const user = userEvent.setup();
    const item = makeItem({ id: 1, title: "Áo thun xóa" });
    renderWithProviders(<CartPage />, {
      preloadedState: { cart: { items: [item] } },
    });
    // Act
    const deleteBtn = screen.getByRole("button", { name: /Xóa Áo thun xóa/i });
    await user.click(deleteBtn);
    // Assert
    await waitFor(() => {
      expect(screen.getByText("Giỏ hàng đang trống.")).toBeInTheDocument();
    });
  });
});
