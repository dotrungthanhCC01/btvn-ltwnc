import type { Product } from "../products/types/products.type";

export const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Sports",
  "Toys",
];

export const products: Product[] = Array.from(
  { length: 10000 },
  (_, index) => ({
    id: index + 1,
    title: `Product ${index + 1}`,
    price: Math.floor(Math.random() * 10000) + 1,
    category: categories[index % categories.length],
  }),
);
