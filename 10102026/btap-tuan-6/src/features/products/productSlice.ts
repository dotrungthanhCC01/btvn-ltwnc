import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { Product, ProductState } from "./productType";

const initialState: ProductState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[], void>(
  "products/fetchAll",

  async () => {
    const response = await fetch("https://fakestoreapi.com/products");

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách sản phẩm");
    }

    const data: Product[] = await response.json();

    return data;
  },
);

const productsSlice = createSlice({
  name: "products",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";

        state.error =
          action.error.message ?? "Đã xảy ra lỗi khi lấy sản phẩm";
      });
  },
});

export default productsSlice.reducer;
