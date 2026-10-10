import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { removeItem, updateQuantity } from "./cartSlice";
import { calculateTotal, calculateTotalQuantity } from "./cartUtils";

export default function CartPage() {
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.cart.items);

  const totalQuantity = calculateTotalQuantity(items);

  const totalPrice = calculateTotal(items);

  return (
    <section aria-label="Giỏ hàng">
      <h2>Giỏ hàng</h2>

      {items.length === 0 ? (
        <p>Giỏ hàng đang trống.</p>
      ) : (
        <>
          {items.map((item) => (
            <article key={item.id} aria-label={item.title}>
              <h3>{item.title}</h3>

              <p>Đơn giá: {item.price.toLocaleString()} VNĐ</p>

              <p>Số lượng: {item.quantity}</p>

              <button
                aria-label={`Giảm số lượng ${item.title}`}
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
                aria-label={`Tăng số lượng ${item.title}`}
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

              <button
                aria-label={`Xóa ${item.title}`}
                onClick={() => dispatch(removeItem(item.id))}
              >
                Xóa
              </button>
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
