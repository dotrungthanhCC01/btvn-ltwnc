import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { removeItem, updateQuantity } from "./cartSlice";

export default function CartPage() {
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.cart.items);

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <section>
      <h2>Giỏ hàng</h2>

      {items.length === 0 ? (
        <p>Giỏ hàng đang trống.</p>
      ) : (
        <>
          {items.map((item) => (
            <article key={item.id}>
              <h3>{item.title}</h3>

              <p>Đơn giá: {item.price.toLocaleString()} VNĐ</p>

              <p>Số lượng: {item.quantity}</p>

              <button
                disabled={item.quantity <= 1}
                onClick={() =>
                  dispatch(
                    updateQuantity({
                      id: item.id,
                      quantity: item.quantity - 1,
                    }),
                  )
                }
              >
                -
              </button>

              <button
                onClick={() =>
                  dispatch(
                    updateQuantity({
                      id: item.id,
                      quantity: item.quantity + 1,
                    }),
                  )
                }
              >
                +
              </button>

              <button onClick={() => dispatch(removeItem(item.id))}>Xóa</button>
            </article>
          ))}
        </>
      )}

      <hr />

      <h3>Tổng số lượng: {totalQuantity}</h3>

      <h3>Tổng tiền: {totalPrice.toLocaleString()} VNĐ</h3>
    </section>
  );
}
