"use client";

import Image from "next/image";
import Link from "next/link";

import { useProducts } from "@/context/ProductsContext";

export default function FeaturedProducts() {
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <section className="featured-products">
        <h2>Featured Products</h2>

        <p>Loading products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-products">
        <h2>Featured Products</h2>

        <p>
          Unable to load products at this time.
        </p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="featured-products">
        <h2>Featured Products</h2>

        <p>
          No products have been added by sellers yet.
        </p>

        <Link
          href="/products"
          className="primary-btn"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  const featuredProducts = products.slice(0, 4);

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>

      <div className="product-grid">
        {featuredProducts.map((product) => (
          <Link
            href={`/products/${product.id}`}
            className="product-card"
            key={product.id}
          >
            <div className="product-image">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />
            </div>

            <span className="product-category">
              {product.category}
            </span>

            <h3>{product.name}</h3>

            <p className="product-seller">
              By {product.seller}
            </p>

            <p className="product-price">
              ${product.price}
            </p>
          </Link>
        ))}
      </div>

      {products.length > 4 && (
        <div className="featured-products-action">
          <Link
            href="/products"
            className="primary-btn"
          >
            View All Products
          </Link>
        </div>
      )}
    </section>
  );
}