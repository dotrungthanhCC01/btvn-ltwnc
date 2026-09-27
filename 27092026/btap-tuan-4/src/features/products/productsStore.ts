import { create } from "zustand";
import type { Product } from "../products/types/products.type";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await fetch("https://fakestoreapi.com/products");

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách sản phẩm");
      }

      const data: Product[] = await response.json();

      set({
        products: data,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Có lỗi xảy ra",
      });
    }
  },
}));
