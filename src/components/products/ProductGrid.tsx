"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [sortOption, setSortOption] =
    useState("default");
  const [priceFilter, setPriceFilter] =
    useState("all");


  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        products.map((product) => product.category)
      ),
    ];
  }, []);


  const filteredProducts = products
    .filter((product) => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());


      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;


      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "under25" &&
          product.price < 25) ||
        (priceFilter === "25to50" &&
          product.price >= 25 &&
          product.price <= 50) ||
        (priceFilter === "over50" &&
          product.price > 50);


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


  return (
    <section className="products-grid-section">


      {/* Search and Filtering Area */}
      <div className="product-filter-panel">


        {/* Search */}
        <div className="product-search">
          <input
            type="text"
            placeholder="Search handcrafted products..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
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
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>

          ))}

        </div>




        {/* Sorting and Price */}
        <div className="product-toolbar">


          <div className="sort-products">

            <label htmlFor="sort">
              Sort By
            </label>


            <select
              id="sort"
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value)
              }
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




          <div className="price-filter">

            <label htmlFor="price">
              Price
            </label>


            <select
              id="price"
              value={priceFilter}
              onChange={(e) =>
                setPriceFilter(e.target.value)
              }
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

      <div className="products-result-header">

        <h2>
          Featured Handmade Collection
        </h2>

        <p>
          Showing {filteredProducts.length} handcrafted products
        </p>

      </div>




      {/* Products Display */}

      {filteredProducts.length === 0 ? (

        <p className="no-products">
          No products found.
        </p>

      ) : (

        <div className="products-grid">

          {filteredProducts.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      )}


    </section>
  );
}