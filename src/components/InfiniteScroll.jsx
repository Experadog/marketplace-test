import { useEffect, useRef } from "react";

export default function InfiniteScroll({ loadMore, hasMore }) {
  const loaderRef = useRef();

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return <div ref={loaderRef} className="scroll-anchor">{hasMore ? "Загрузка..." : "Конец списка"}</div>;
}