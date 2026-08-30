
/* ============================================================
 * 1. ENUM
 * ============================================================ */

/**
 * dùng enum cho trạng thái đơn hàng vì OrderStatus chỉ có một
 * tập giá trị xác định. Cách này giúp TypeScript kiểm soát dữ liệu
 * và tránh việc truyền nhầm một chuỗi không hợp lệ.
 *
 * dùng string enum để khi lưu hoặc log dữ liệu có thể đọc được
 * trực tiếp như "PENDING", "SHIPPING" thay vì các giá trị số.
 */
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPING = "SHIPPING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

/**
 * tách PaymentMethod khỏi OrderStatus vì trạng thái đơn hàng
 * và phương thức thanh toán là hai thông tin khác nhau.
 */
export enum PaymentMethod {
  COD = "COD",
  BANK_TRANSFER = "BANK_TRANSFER",
  E_WALLET = "E_WALLET",
}

/* ============================================================
 * 2. PRODUCT
 * ============================================================ */

/**
 * tạo Product thành một interface riêng vì sản phẩm là một
 * đối tượng độc lập trong hệ thống và có thể được sử dụng ở nhiều
 * nơi như danh sách sản phẩm, giỏ hàng và đơn hàng.
 *
 * id dùng để định danh sản phẩm.
 * name là tên sản phẩm.
 * price là giá hiện tại của sản phẩm.
 * sku là mã sản phẩm.
 * stockQuantity là số lượng tồn kho.
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  stockQuantity: number;
}

/* ============================================================
 * 3. CUSTOMER
 * ============================================================ */

/**
 * tạo Customer thành interface riêng để mô tả thông tin
 * của người mua. Một Customer có thể tạo nhiều Order nên
 * không đưa thông tin Order trực tiếp vào Customer.
 *
 * address là optional vì khi tạo khách hàng có thể chưa có
 * địa chỉ. Dấu ? giúp dữ liệu phản ánh đúng trường hợp này.
 */
export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
}

/* ============================================================
 * 4. ORDER ITEM - GENERIC
 * ============================================================ */

/**
 * dùng generic <TProduct = Product> cho OrderItem vì một
 * OrderItem cần chứa thông tin của một Product.
 *
 * Generic giúp có thể sử dụng OrderItem với Product đầy đủ
 * hoặc với một Product đã được rút gọn bằng Pick mà không phải
 * tạo thêm interface khác.
 *
 * Ví dụ:
 * OrderItem<Product>
 * OrderItem<Pick<Product, "name" | "price">>
 *
 * đặt giá tại thời điểm đặt hàng thành một field riêng.
 * Lý do là Product.price có thể thay đổi sau này, nhưng giá của
 * sản phẩm trong đơn hàng cũ phải được giữ nguyên.
 */
export interface OrderItem<TProduct = Product> {
  product: TProduct;
  quantity: number;
  unitPriceAtOrderTime: number;
}

/* ============================================================
 * 5. ORDER - GENERIC
 * ============================================================ */

/**
 * tiếp tục sử dụng generic cho Order thông qua TItem.
 *
 * Order chứa nhiều OrderItem nên khai báo items là TItem[].
 * TItem extends OrderItem đảm bảo kiểu được truyền vào phải có
 * đúng cấu trúc của một OrderItem.
 *
 * Nhờ đó có thể tái sử dụng Order với các biến thể OrderItem
 * khác nhau mà không cần tạo lại interface Order.
 *
 * customer dùng Customer vì một Order cần xác định khách hàng
 * thực hiện đơn hàng.
 *
 * status dùng OrderStatus và paymentMethod dùng PaymentMethod
 * để chỉ cho phép các giá trị hợp lệ.
 *
 * shippedAt là optional vì khi đơn mới tạo thì chưa có thời điểm
 * giao hàng.
 */
export interface Order<TItem extends OrderItem = OrderItem> {
  id: string;
  customer: Customer;
  items: TItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  shippedAt?: Date;
}

/**
 * viết hàm generic để tính tổng tiền của Order.
 *
 * dùng <TItem extends OrderItem> để hàm có thể làm việc với
 * mọi biến thể OrderItem, miễn là biến thể đó có quantity và
 * unitPriceAtOrderTime.
 *
 * Như vậy chỉ viết hàm tính tổng một lần và có thể tái sử dụng.
 */
export function calculateOrderTotal<TItem extends OrderItem>(
  order: Order<TItem>
): number {
  return order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceAtOrderTime,
    0
  );
}

/* ============================================================
 * 6. GENERIC API RESPONSE
 * ============================================================ */

/**
 * sử dụng ApiResponse<TData> theo ví dụ Generic trong slide.
 *
 * Các API của Product, Customer và Order có cùng một cấu trúc
 * response nhưng dữ liệu trả về khác nhau.
 *
 * Vì vậy dùng generic thay vì viết riêng:
 * ProductResponse, CustomerResponse, OrderResponse...
 *
 * Ví dụ:
 * ApiResponse<Product>
 * ApiResponse<Order>
 * ApiResponse<Product[]>
 */
export interface ApiResponse<TData> {
  success: boolean;
  data: TData | null;
  message?: string;
}

/* ============================================================
 * 7. UTILITY TYPES
 * ============================================================ */

/**
 * Omit<Product, "id">:
 *
 * dùng Omit khi tạo Product mới vì id chưa cần truyền từ phía
 * người dùng và thường được hệ thống tạo ra.
 *
 * Thay vì viết lại một interface mới có toàn bộ field của Product
 * nhưng bỏ id, tái sử dụng Product bằng Omit.
 */
export type CreateProductDto = Omit<Product, "id">;

/**
 * Partial<T> biến tất cả thuộc tính của T thành optional.
 *
 * dùng Partial cho cập nhật Product vì khi cập nhật có thể
 * chỉ thay đổi một field, ví dụ chỉ thay đổi price mà không cần
 * truyền lại toàn bộ Product.
 */
export type UpdateProductDto = Partial<CreateProductDto>;

/**
 * dùng Omit cho CreateOrderDto vì khi client tạo Order:
 * - id do hệ thống tạo
 * - createdAt do hệ thống gán
 * - status của đơn mới có thể được hệ thống đặt là PENDING
 * - shippedAt chưa có khi đơn mới được tạo
 *
 * Như vậy client không cần gửi những dữ liệu do hệ thống quản lý.
 */
export type CreateOrderDto = Omit<
  Order,
  "id" | "createdAt" | "status" | "shippedAt"
>;

/**
 * dùng Pick để tạo type chỉ chứa những field cần thiết
 * của Customer khi cập nhật.
 *
 * Sau đó dùng Partial để các field này đều có thể bỏ qua.
 * Ví dụ chỉ có thể cập nhật phone mà không cần gửi fullName
 * hoặc address.
 */
export type UpdateCustomerDto = Partial<
  Pick<Customer, "fullName" | "phone" | "address">
>;

/**
 * dùng Pick để tạo dữ liệu rút gọn cho màn hình danh sách
 * đơn hàng. Màn hình danh sách không nhất thiết phải lấy toàn bộ
 * dữ liệu của Order.
 */
export type OrderSummaryView = Pick<
  Order,
  "id" | "status" | "createdAt"
> & {
  customerName: string;
  totalAmount: number;
};

/* ============================================================
 * 8. KẾT HỢP GENERIC + UTILITY TYPES
 * ============================================================ */

/**
 * kết hợp Generic với Omit và Partial để tạo một cấu trúc
 * dùng chung cho các entity có id.
 *
 * TEntity extends HasId đảm bảo entity phải có id.
 *
 * Create bỏ id vì id thường do hệ thống tạo.
 * Update dùng Partial vì khi cập nhật không cần truyền toàn bộ field.
 *
 * Ví dụ:
 * CrudDto<Product>
 * CrudDto<Customer>
 *
 * không cần viết lại cùng một cấu trúc Create/Update cho từng entity.
 */
export interface HasId {
  id: string;
}

export type CrudDto<TEntity extends HasId> = {
  Create: Omit<TEntity, "id">;
  Update: Partial<Omit<TEntity, "id">>;
};

/* ============================================================
 * 9. VÍ DỤ SỬ DỤNG
 * ============================================================ */

/**
 * tạo các ví dụ dưới đây để kiểm tra rằng những type đã thiết kế
 * có thể kết hợp với nhau đúng như mục đích.
 */
export const sampleProduct: Product = {
  id: "prod_001",
  name: "Bàn phím cơ AKKO",
  price: 1_200_000,
  sku: "AKKO-3068",
  stockQuantity: 50,
};

export const sampleCustomer: Customer = {
  id: "cus_001",
  fullName: "Nguyễn Văn A",
  email: "a.nguyen@example.com",
  phone: "0901234567",
};

export const sampleOrder: Order = {
  id: "order_001",
  customer: sampleCustomer,
  items: [
    {
      product: sampleProduct,
      quantity: 2,
      unitPriceAtOrderTime: sampleProduct.price,
    },
  ],
  status: OrderStatus.PENDING,
  paymentMethod: PaymentMethod.COD,
  createdAt: new Date(),
};

export const total = calculateOrderTotal(sampleOrder);

/**
 * sử dụng Pick kết hợp với generic OrderItem để chỉ truyền
 * những thông tin Product cần thiết.
 */
export const compactItem: OrderItem<
  Pick<Product, "name" | "price">
> = {
  product: {
    name: sampleProduct.name,
    price: sampleProduct.price,
  },
  quantity: 2,
  unitPriceAtOrderTime: sampleProduct.price,
};
