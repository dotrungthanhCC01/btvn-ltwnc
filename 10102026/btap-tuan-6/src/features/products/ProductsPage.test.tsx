import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "../../test/renderWithProviders";
import ProductList from "./ProductsPage";
import type { Product } from "./productType";

// ─── Dữ liệu mẫu ────────────────────────────────────────────────────────────
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Áo thun nam",
    price: 150_000,
    image: "https://example.com/ao.jpg",
  },
  {
    id: 2,
    title: "Quần jean nữ",
    price: 350_000,
    image: "https://example.com/quan.jpg",
  },
];

// ─── NHÓM C – Test bất đồng bộ với API mock ────────────────────────────────
describe("ProductList – async API mock", () => {
  beforeEach(() => {
    // Reset global.fetch trước mỗi test
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // TC-21 – Bất đồng bộ: trạng thái loading
  it("hiển thị trạng thái loading khi đang tải sản phẩm", async () => {
    // Arrange: mock fetch không bao giờ resolve (giả lập đang loading)
    vi.spyOn(globalThis, "fetch").mockImplementation(
      () => new Promise(() => {}), // pending promise
    );

    // Act
    renderWithProviders(<ProductList />, {
      preloadedState: {
        products: { items: [], status: "loading", error: null },
      },
    });

    // Assert
    expect(screen.getByText("Đang tải sản phẩm...")).toBeInTheDocument();
  });

  // TC-22 – Bất đồng bộ: API thành công
  it("hiển thị danh sách sản phẩm khi API trả về thành công", async () => {
    // Arrange: mock fetch trả về danh sách sản phẩm
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    } as Response);

    // Act
    renderWithProviders(<ProductList />, {
      preloadedState: {
        products: { items: [], status: "idle", error: null },
      },
    });

    // Assert: chờ sản phẩm xuất hiện
    expect(await screen.findByText("Áo thun nam")).toBeInTheDocument();
    expect(screen.getByText("Quần jean nữ")).toBeInTheDocument();
  });

  // TC-23 – Bất đồng bộ: API thất bại
  it("hiển thị thông báo lỗi khi API thất bại", async () => {
    // Arrange: mock fetch trả về response lỗi
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    // Act
    renderWithProviders(<ProductList />, {
      preloadedState: {
        products: { items: [], status: "idle", error: null },
      },
    });

    // Assert: chờ thông báo lỗi xuất hiện
    expect(
      await screen.findByText(/Lỗi:.*Không thể lấy danh sách sản phẩm/),
    ).toBeInTheDocument();
  });

  // TC-24 – Integration: hiển thị sản phẩm từ preloaded state
  it("hiển thị danh sách sản phẩm khi state đã có dữ liệu", () => {
    // Arrange & Act
    renderWithProviders(<ProductList />, {
      preloadedState: {
        products: {
          items: mockProducts,
          status: "succeeded",
          error: null,
        },
      },
    });

    // Assert
    expect(screen.getByText("Áo thun nam")).toBeInTheDocument();
    expect(screen.getByText(/150\.000/)).toBeInTheDocument();
  });

  // TC-25 – Integration: click "Thêm vào giỏ" thêm sản phẩm vào cart store
  it("click 'Thêm vào giỏ' thêm sản phẩm vào giỏ hàng", async () => {
    // Arrange
    const user = userEvent.setup();

    const { store } = renderWithProviders(<ProductList />, {
      preloadedState: {
        products: { items: mockProducts, status: "succeeded", error: null },
        cart: { items: [] },
      },
    });

    // Act
    const addBtn = screen.getByRole("button", {
      name: /Thêm Áo thun nam vào giỏ/i,
    });
    await user.click(addBtn);

    // Assert: store cart có 1 item
    await waitFor(() => {
      const cartItems = store.getState().cart.items;
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].title).toBe("Áo thun nam");
    });
  });

  // TC-26 – Reducer fallback error
  it("xử lý fetchProducts.rejected với thông báo lỗi mặc định khi không có message", async () => {
    const { default: productsReducer, fetchProducts } = await import(
      "./productSlice"
    );
    const nextState = productsReducer(
      { items: [], status: "loading", error: null },
      { type: fetchProducts.rejected.type, error: {} },
    );
    expect(nextState.status).toBe("failed");
    expect(nextState.error).toBe("Đã xảy ra lỗi khi lấy sản phẩm");
  });
});
