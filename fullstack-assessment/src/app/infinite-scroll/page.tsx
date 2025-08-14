"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

export default function InfiniteScrollPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Fetch products
  const fetchProducts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://dummyjson.com/products?limit=10&skip=${skip}`
      );
      const newProducts: Product[] = res.data.products;

      setProducts((prev) => [...prev, ...newProducts]);
      setSkip((prev) => prev + newProducts.length);

      if (newProducts.length === 0) setHasMore(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchProducts();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loaderRef, loading, hasMore]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Infinite Scroll Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded p-4 flex flex-col items-center"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-32 h-32 object-cover mb-2"
            />
            <h2 className="font-bold">{product.title}</h2>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>

      {loading && <p className="text-center mt-4">Loading...</p>}
      {!hasMore && <p className="text-center mt-4">No more products</p>}

      {/* Invisible loader div for IntersectionObserver */}
      <div ref={loaderRef} className="h-1"></div>
    </div>
  );
}
