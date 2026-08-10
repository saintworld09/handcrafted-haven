"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";

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

  const [quantity, setQuantity] = useState(1);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const product = products.find(
    (item) => item.id === Number(id)
  );

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

  function handleDelete() {
    if (!product) return;

    deleteProduct(product.id);
    setShowDeleteModal(false);

    toast.success("Product deleted successfully.");

    router.push("/products");
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
      <div className="product-details-header">
        <Link
          href="/products"
          className="back-to-products"
        >
          ← Back to Products
        </Link>
      </div>

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

          <div className="product-actions">
            <button
              type="button"
              className="add-cart-btn"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>

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

            <Link
              href={`/sellers/${product.sellerId}`}
              className="primary-btn"
            >
              Contact Seller
            </Link>
          </div>
        </div>
      </section>

      <section className="product-reviews-section">
        <ProductReviews productId={product.id} />
      </section>

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
    </main>
  );
}
