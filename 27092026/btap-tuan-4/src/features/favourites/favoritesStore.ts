import { create } from "zustand";
import type { Product } from "../products/types/products.type";

interface FavoritesState {
  favorites: Product[];

  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  addFavorite: (product) => {
    const exists = get().favorites.some((item) => item.id === product.id);

    if (exists) {
      return;
    }

    set((state) => ({
      favorites: [...state.favorites, product],
    }));
  },

  removeFavorite: (productId) => {
    set((state) => ({
      favorites: state.favorites.filter((item) => item.id !== productId),
    }));
  },

  toggleFavorite: (product) => {
    const exists = get().favorites.some((item) => item.id === product.id);

    if (exists) {
      set((state) => ({
        favorites: state.favorites.filter((item) => item.id !== product.id),
      }));
    } else {
      set((state) => ({
        favorites: [...state.favorites, product],
      }));
    }
  },

  isFavorite: (productId) => {
    return get().favorites.some((item) => item.id === productId);
  },
}));
