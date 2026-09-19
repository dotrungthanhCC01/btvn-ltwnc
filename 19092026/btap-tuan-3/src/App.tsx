import React from "react";
import ProductList from "./features/products/ProductsPage";
import CartPage from "./features/cart/CartPage";

export default function App() {
  return (
    <div>
      <h1>Redux Toolkit Shopping Cart</h1>

      <ProductList />

      <hr />

      <CartPage />
    </div>
  );
}
