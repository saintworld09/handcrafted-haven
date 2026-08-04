"use client";

import { useMemo, useState } from "react";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const { products } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [priceFilter, setPriceFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Categories
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(products.map((product) => product.category)),
    ];
  }, [products]);

  // Filter + Sort
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "under25" && product.price < 25) ||
        (priceFilter === "25to50" &&
          product.price >= 25 &&
          product.price <= 50) ||
        (priceFilter === "over50" && product.price > 50);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice
      );
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "name-asc":
          return a.name.localeCompare(b.name);

        case "name-desc":
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });

  // Prevent invalid page numbers after filtering
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex =
    (safeCurrentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <section className="products-grid-section">

      {/* Search & Filter Panel */}
      <div className="product-filter-panel">

        {/* Search */}
        <div className="product-search">
          <input
            type="text"
            placeholder="Search handcrafted products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Categories */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="product-toolbar">

          {/* Sort */}
          <div className="sort-products">
            <label htmlFor="sort">
              Sort By
            </label>

            <select
              id="sort"
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="default">
                Featured
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="name-asc">
                Name: A-Z
              </option>

              <option value="name-desc">
                Name: Z-A
              </option>
            </select>
          </div>

          {/* Price */}
          <div className="price-filter">
            <label htmlFor="price">
              Price
            </label>

            <select
              id="price"
              value={priceFilter}
              onChange={(e) => {
                setPriceFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">
                All Prices
              </option>

              <option value="under25">
                Under $25
              </option>

              <option value="25to50">
                $25 - $50
              </option>

              <option value="over50">
                Over $50
              </option>
            </select>
          </div>

        </div>

      </div>

      {/* Results */}
      <div className="products-result-header">
        <h2>
          Featured Handmade Collection
        </h2>

        <p>
          Showing {filteredProducts.length} handcrafted product
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="no-products">
          No products found.
        </p>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">

              <button
                className="pagination-btn"
                disabled={safeCurrentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
              >
                ← Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${
                    safeCurrentPage === page
                      ? "active-page"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination-btn"
                disabled={
                  safeCurrentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
              >
                Next →
              </button>

            </div>
          )}
        </>
      )}
    </section>
  );
}