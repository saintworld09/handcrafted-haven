"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

import ProductReviews from "./ProductReviews";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface ProductDetailsClientProps {
  id: string;
}

export default function ProductDetailsClient({
  id,
}: ProductDetailsClientProps) {
  const router = useRouter();

  const { products, deleteProduct } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const product = products.find(
    (item) => item.id === id
  );

  const isSeller = user?.role === "seller";

  const isProductOwner =
    isSeller &&
    user.id === product?.sellerId;

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  function handleAddToCart() {
    if (!product) return;

    if (!user) {
      toast.error(
        "Please log in as a buyer to add products to your cart."
      );
      return;
    }

    if (user.role !== "buyer") {
      toast.error(
        "Only buyer accounts can add products to the cart."
      );
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        seller: product.seller,
      });
    }

    toast.success(
      quantity === 1
        ? `${product.name} added to cart!`
        : `${quantity} × ${product.name} added to cart!`
    );
  }

  async function handleDelete() {
    if (!product) return;

    if (!isProductOwner) {
      toast.error(
        "You can only delete your own products."
      );
      return;
    }

    try {
      await deleteProduct(product.id);

      setShowDeleteModal(false);

      toast.success(
        "Product deleted successfully."
      );

      router.push("/products");
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      toast.error(
        "Failed to delete product. Please try again."
      );
    }
  }

  if (!product) {
    return (
      <main className="product-not-found">
        <h1>Product Not Found</h1>

        <p>
          Sorry, we could not find the product you are
          looking for.
        </p>

        <Link
          href="/products"
          className="primary-btn"
        >
          ← Back to Products
        </Link>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <Link
        href="/products"
        className="back-link"
      >
        ← Back to Products
      </Link>

      <section className="product-details-container">
        <div className="product-details-image">
          <Image
            src={product.image}
            alt={product.name}
            width={700}
            height={500}
            priority
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </div>

        <div className="product-details-content">
          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <div className="product-rating">
            <span className="stars">
              {"★".repeat(
                Math.round(product.rating)
              )}
            </span>

            <span className="rating-text">
              {product.rating.toFixed(1)} (
              {product.reviewCount} reviews)
            </span>
          </div>

          <p className="product-description">
            {product.description}
          </p>

          <p className="product-seller">
            Crafted by{" "}
            <strong>{product.seller}</strong>
          </p>

          <h2 className="product-price">
            ${product.price.toFixed(2)}
          </h2>

          {/* Quantity is only useful for buyers */}
          {user?.role === "buyer" && (
            <div className="product-quantity">
              <span>Quantity</span>

              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="product-actions">
            {/* BUYER ONLY */}
            {user?.role === "buyer" && (
              <button
                type="button"
                className="add-cart-btn"
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </button>
            )}

            {/* PRODUCT OWNER / SELLER ONLY */}
            {isProductOwner && (
              <>
                <Link
                  href={`/products/edit/${product.id}`}
                  className="edit-product-btn"
                >
                  Edit Product
                </Link>

                <button
                  type="button"
                  className="delete-product-btn"
                  onClick={() =>
                    setShowDeleteModal(true)
                  }
                >
                  Delete Product
                </button>
              </>
            )}

            {/* EVERYONE EXCEPT THE PRODUCT OWNER */}
            {!isProductOwner && (
              <Link
                href={`/sellers/${product.sellerId}`}
                className="primary-btn"
              >
                Contact Seller
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="product-reviews-section">
        <ProductReviews
          productId={product.id}
        />
      </section>

      {/* Delete confirmation */}
      {isProductOwner && (
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete Product"
          message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
          confirmText="Delete Product"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() =>
            setShowDeleteModal(false)
          }
        />
      )}
    </main>
  );
}