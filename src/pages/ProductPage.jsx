import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import data from "../data/products.json";
import { formatDate } from "../utils/formatDate";
import { formatPrice } from "../utils/formatPrice";

export default function ProductPage() {
  const { id } = useParams();
  const product = data.find((p) => p.id === id);

  // Тоггл: ключ сортировки (price|date) + направление (asc|desc)
  const [sort, setSort] = useState({ key: "price", order: "asc" });

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, order: prev.order === "asc" ? "desc" : "asc" } // клик по активной — инвертируем
        : { key, order: "asc" } // сменили поле — начинаем с asc
    );
  };

  const sortedOffers = useMemo(() => {
    if (!product) return [];
    const offers = [...product.offers];

    offers.sort((a, b) => {
      let cmp = 0;
      if (sort.key === "price") {
        cmp = a.price - b.price;
      } else {
        cmp =
          new Date(a.deliveryDate).getTime() -
          new Date(b.deliveryDate).getTime();
      }
      return sort.order === "asc" ? cmp : -cmp;
    });

    return offers;
  }, [sort, product]);

  if (!product) return <div>Товар не найден</div>;

  return (
    <main className="container product-page">
      <Link to="/">← Назад</Link>

      <div className="product-detail">
        <img src={product.fullImage} alt={product.name} />
        <div>
          <h2>{product.name}</h2>
          <p>⭐ {product.rating}</p>

          <ul>
            {product.attributes.map((attr, i) => (
              <li key={i}>
                <b>{attr.name}:</b> {attr.value}
              </li>
            ))}
          </ul>

          <div className="btn-container">
            <button>Характеристики и описание</button>
          </div>
        </div>
      </div>

      <div className="offers">
        <h3>Предложения продавцов</h3>

        <div className="sort-buttons" role="tablist" aria-label="Сортировка">
          <button
            className="sort-btn"
            aria-pressed={sort.key === "price"}
            data-order={sort.key === "price" ? sort.order : undefined}
            onClick={() => handleSort("price")}
          >
            По цене
          </button>
          <button
            className="sort-btn"
            aria-pressed={sort.key === "date"}
            data-order={sort.key === "date" ? sort.order : undefined}
            onClick={() => handleSort("date")}
          >
            По дате доставки
          </button>
        </div>

        {sortedOffers.map((offer, i) => (
          <div key={i} className="offer">
            <p>
              <b>{offer.seller}</b> — ⭐ {offer.rating}
            </p>
            <p>{formatPrice(offer.price, product.currency)}</p>
            <p>Доставка: {formatDate(offer.deliveryDate)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}