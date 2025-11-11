import { useEffect, useState } from "react";
import data from "../data/products.json";
import InfiniteScroll from "./InfiniteScroll";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    const newCount = count + 20;
    const newItems = data.slice(0, newCount);
    setVisibleProducts(newItems);
    setCount(newCount);
    if (newCount >= data.length) setHasMore(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div>
      <div className="grid">
        {visibleProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}