import type { Product } from "../products/productType";

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}
