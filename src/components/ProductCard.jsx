import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { formatPrice } from "../utils/formatPrice";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <img src={product.fullImage} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{formatPrice(product.price, product.currency)}</p>
        <p>В наличии: {product.stock}</p>
        <p>Доставка: {formatDate(product.deliveryDate)}</p>
        <p>⭐ {product.rating}</p>
      </div>
    </Link>
  );
}