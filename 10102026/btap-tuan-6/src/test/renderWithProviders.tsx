import React from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import cartReducer from "../features/cart/cartSlice";
import productsReducer from "../features/products/productSlice";
import type { RootState } from "../app/store";

type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

const rootReducer = combineReducers({
  cart: cartReducer,
  products: productsReducer,
});

export function setupStore(preloadedState?: DeepPartial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as unknown as Parameters<typeof rootReducer>[0],
  });
}

export type AppStore = ReturnType<typeof setupStore>;

interface RenderWithProvidersOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: DeepPartial<RootState>;
  store?: AppStore;
}

/**
 * Helper render bọc component trong Redux Provider với store mới tạo.
 * Cho phép truyền preloadedState để kiểm thử với dữ liệu ban đầu.
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
