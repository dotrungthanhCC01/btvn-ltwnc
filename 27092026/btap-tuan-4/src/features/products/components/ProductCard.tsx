import type { Product } from "../types/products.type";
import { useFavoritesStore } from "../../favourites/favoritesStore";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));

  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />

        <button
          className={`favorite-button ${isFavorite ? "active" : ""}`}
          onClick={() => toggleFavorite(product)}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>

        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
    </article>
  );
};
