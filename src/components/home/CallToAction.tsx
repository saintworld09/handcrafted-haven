"use client";

import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

export default function CallToAction() {
  const { user } = useAuth();

  /*
   * Visitor
   */

  if (!user) {
    return (
      <section className="call-to-action">
        <h2>Become a Seller</h2>

        <p>
          Share your handcrafted creations
          with customers who appreciate
          unique, high-quality handmade
          products.
        </p>

        <Link
          href="/register"
          className="cta-btn"
        >
          Join Our Marketplace
        </Link>
      </section>
    );
  }

  /*
   * Buyer
   */

  if (user.role === "buyer") {
    return (
      <section className="call-to-action">
        <h2>Find Something Special</h2>

        <p>
          Explore unique handcrafted products
          from talented artisans and discover
          something made just for you.
        </p>

        <Link
          href="/products"
          className="cta-btn"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  /*
   * Seller
   */

  return (
    <section className="call-to-action">
      <h2>Share Your Craftsmanship</h2>

      <p>
        Add your latest handcrafted creations
        and make them available to customers
        around the world.
      </p>

      <Link
        href="/products/add"
        className="cta-btn"
      >
        Add a Product
      </Link>
    </section>
  );
}