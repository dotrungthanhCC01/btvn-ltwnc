import { Provider } from "react-redux";
import { store } from "./app/store";
import CartPage from "./features/cart/CartPage";
import ProductList from "./features/products/ProductsPage";

export default function App() {
  return (
    <Provider store={store}>
      <main>
        <h1>Cửa hàng trực tuyến – Bài tập Tuần 6</h1>
        <ProductList />
        <CartPage />
      </main>
    </Provider>
  );
}
