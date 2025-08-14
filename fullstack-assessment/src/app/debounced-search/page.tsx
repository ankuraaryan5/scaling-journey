"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
};

export default function DebouncedSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
          );
          const data = await res.json();
          setResults(data.products || []);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }, 1000); // 1 second debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md relative">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />

        {loading && (
          <p className="absolute right-3 top-2 text-sm text-gray-500">Loading...</p>
        )}

        {showDropdown && results.length > 0 && (
          <ul className="absolute mt-1 w-full  border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
            {results.map((product) => (
              <li
                key={product.id}
                className="px-4 py-2 hover:bg-gray-100 hover:text-red-500d cursor-pointer border-1 "
                onClick={() => {
                  setQuery(product.title);
                  setShowDropdown(false);
                }}
              >
                {product.title}
              </li>
            ))}
          </ul>
        )}

        {showDropdown && !loading && query.trim() && results.length === 0 && (
          <p className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg px-4 py-2 text-gray-500">
            No results found
          </p>
        )}
      </div>
    </main>
  );
}
