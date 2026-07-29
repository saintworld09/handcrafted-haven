"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {

  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <article className="product-card">
      <div className="product-card-image">
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

      <div className="product-card-content">
        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description}
        </p>

        <p className="product-seller">
          By {product.seller}
        </p>

        <div className="product-rating">
          <span className="stars">
            ★★★★★
          </span>

          <span className="rating-text">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>


        <div className="product-footer">

        <span className="product-price">
          ${product.price}
        </span>

        <div className="product-actions">

          <button
            className={
              isFavorite
                ? "favorite-btn saved"
                : "favorite-btn"
            }
            onClick={() =>
              setIsFavorite(!isFavorite)
            }
          >
            {isFavorite
              ? "❤️ Saved"
              : "🤍 Favorite"}
          </button>

          <Link
            href={`/products/${product.id}`}
            className="view-product-btn"
          >
            View Details
          </Link>

        </div>

      </div>



        

      </div>
    </article>
  );
}