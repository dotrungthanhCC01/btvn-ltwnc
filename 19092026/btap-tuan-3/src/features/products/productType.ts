export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export type LoadingStatus = "idle" | "loading" | "succeeded" | "failed";

export interface ProductState {
  items: Product[];
  status: LoadingStatus;
  error: string | null;
}
