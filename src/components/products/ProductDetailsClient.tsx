"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import ProductReviews from "./ProductReviews";
import ConfirmModal from "@/components/ui/ConfirmModal";


interface ProductDetailsClientProps {
  id: string;
}

export default function ProductDetailsClient({
  id,
}: ProductDetailsClientProps) {
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] =
  useState(false);

  const { products, deleteProduct } = useProducts();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  function handleDelete() {
  deleteProduct(Number(id));

  setShowDeleteModal(false);

  router.push("/products");
}

  if (!product) {
    return (
      <main className="product-details-page">
        <h1>Product not found</h1>

        <Link href="/products">
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

      <div className="product-details-container">
        <div className="product-details-image">
          <Image
            src={product.image}
            alt={product.name}
            width={700}
            height={500}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>

        <div className="product-details-content">
          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="product-description">
            {product.description}
          </p>

          <p className="product-seller">
            Crafted by{" "}
            <strong>{product.seller}</strong>
          </p>

          <h2 className="product-price">
            ${product.price}
          </h2>

          <div className="product-actions">
            <Link
              href={`/products/edit/${product.id}`}
              className="edit-product-btn"
            >
              Edit Product
            </Link>

            <button
        type="button"
        className="delete-product-btn"
        onClick={function () {
            setShowDeleteModal(true);
        }}
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
      </div>

      

      <ProductReviews />

      <ConfirmModal
  isOpen={showDeleteModal}
  title="Delete Product"
  message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
  confirmText="Delete Product"
  cancelText="Cancel"
  onConfirm={handleDelete}
  onCancel={() => setShowDeleteModal(false)}
/>

    

    </main>
  );
}