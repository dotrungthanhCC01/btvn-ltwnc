import { useFavoritesStore } from "../favoritesStore";

export const FavoriteList = () => {
  const favorites = useFavoritesStore((state) => state.favorites);

  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  return (
    <section className="favorites-section">
      <div className="section-header">
        <div>
          <h2>❤️ Sản phẩm yêu thích</h2>

          <p>Danh sách các sản phẩm bạn đã yêu thích</p>
        </div>

        <span className="favorite-count">{favorites.length}</span>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <span>🤍</span>

          <p>Chưa có sản phẩm yêu thích</p>

          <small>Hãy bấm ❤️ ở sản phẩm bạn muốn lưu.</small>
        </div>
      ) : (
        <div className="favorite-list">
          {favorites.map((product) => (
            <div className="favorite-item" key={product.id}>
              <img src={product.image} alt={product.title} />

              <div className="favorite-info">
                <h3>{product.title}</h3>

                <p>${product.price.toFixed(2)}</p>
              </div>

              <button
                className="remove-button"
                onClick={() => removeFavorite(product.id)}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
