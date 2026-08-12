"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { useProducts } from "@/context/ProductsContext";

interface SellerProfileClientProps {
  id: string;
}

export default function SellerProfileClient({
  id,
}: SellerProfileClientProps) {
  const { products } = useProducts();

  const sellerProducts = useMemo(() => {
    return products.filter(
      (product) => product.sellerId === id
    );
  }, [products, id]);

  const seller = sellerProducts[0];

  if (!seller) {
    return (
      <main className="seller-profile-page">
        <section className="seller-profile-not-found">
          <div className="seller-not-found-icon">
            🧺
          </div>

          <h1>Seller Not Found</h1>

          <p>
            Sorry, we could not find this seller or
            their products.
          </p>

          <Link
            href="/sellers"
            className="primary-btn"
          >
            ← Back to Sellers
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="seller-profile-page">
      <Link
        href="/sellers"
        className="back-link"
      >
        ← Back to Sellers
      </Link>

      {/* Seller Hero */}
      <section className="seller-profile-hero">
        <div className="seller-profile-hero-content">
          <div className="seller-avatar">
            {seller.seller.charAt(0).toUpperCase()}
          </div>

          <div className="seller-profile-info">
            <span className="seller-label">
              Artisan Seller
            </span>

            <h1>{seller.seller}</h1>

            <p className="seller-profile-description">
              Discover unique handcrafted products
              created with creativity, care, and
              authentic craftsmanship.
            </p>

            <div className="seller-profile-stats">
              <div className="seller-stat">
                <strong>
                  {sellerProducts.length}
                </strong>

                <span>
                  {sellerProducts.length === 1
                    ? "Product"
                    : "Products"}
                </span>
              </div>

              <div className="seller-stat-divider" />

              <div className="seller-stat">
                <strong>
                  ★ {seller.rating.toFixed(1)}
                </strong>

                <span>Average Rating</span>
              </div>
            </div>

            <Link
              href={`/sellers/contact/${seller.sellerId}`}
              className="seller-contact-btn"
            >
              ✉ Contact Seller
            </Link>
          </div>
        </div>

        <div className="seller-hero-decoration">
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
        </div>
      </section>

      {/* Products */}
      <section className="seller-products-section">
        <div className="seller-products-heading">
          <div>
            <span className="section-eyebrow">
              HANDCRAFTED COLLECTION
            </span>

            <h2>
              Products by {seller.seller}
            </h2>
          </div>

          <span className="seller-products-count">
            {sellerProducts.length}{" "}
            {sellerProducts.length === 1
              ? "item"
              : "items"}
          </span>
        </div>

        {sellerProducts.length === 0 ? (
          <div className="empty-seller-products">
            <div>🧺</div>

            <h3>No products yet</h3>

            <p>
              This artisan has not added any products
              yet.
            </p>
          </div>
        ) : (
          <div className="seller-product-grid">
            {sellerProducts.map((product) => (
              <article
                key={product.id}
                className="seller-product-card"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="seller-product-link"
                >
                  <div className="seller-product-image">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <span className="seller-product-category">
                      {product.category}
                    </span>
                  </div>

                  <div className="seller-product-content">
                    <div className="seller-product-title-row">
                      <h3>{product.name}</h3>

                      <span className="seller-product-arrow">
                        →
                      </span>
                    </div>

                    <div className="seller-product-rating">
                      <span className="stars">
                        {"★".repeat(
                          Math.round(product.rating)
                        )}
                      </span>

                      <span>
                        {product.rating.toFixed(1)}
                      </span>

                      <span>
                        ({product.reviewCount})
                      </span>
                    </div>

                    <div className="seller-product-footer">
                      <strong>
                        ${product.price.toFixed(2)}
                      </strong>

                      <span>
                        View Product
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}