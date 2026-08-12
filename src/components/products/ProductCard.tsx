"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface ProductCardProps {
product: Product;
}

export default function ProductCard({
product,
}: ProductCardProps) {
const [isFavorite, setIsFavorite] =
useState(false);

const { addToCart } = useCart();
const { user } = useAuth();

function handleAddToCart() {
if (!user) {
toast.error(
"Please log in as a buyer to add products to your cart."
);
return;
}


if (user.role !== "buyer") {
  toast.error(
    "Seller accounts cannot add products to a cart."
  );
  return;
}

addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  seller: product.seller,
});

toast.success(
  `${product.name} added to cart!`
);


}

return ( <article className="product-card">
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
        {product.rating} (
        {product.reviewCount} reviews)
      </span>
    </div>

    <div className="product-footer">
      <span className="product-price">
        ${product.price}
      </span>

      <div className="product-actions">
        <button
          type="button"
          className={
            isFavorite
              ? "favorite-btn saved"
              : "favorite-btn"
          }
          onClick={() =>
            setIsFavorite(
              !isFavorite
            )
          }
        >
          {isFavorite
            ? "❤️ Saved"
            : "🤍 Favorite"}
        </button>

        {user?.role === "buyer" && (
          <button
            type="button"
            className="add-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}

        {!user && (
          <Link
            href="/login"
            className="add-cart-btn"
          >
            Login to Purchase
          </Link>
        )}

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
