"use client";

import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/context/AuthContext";

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-eyebrow">
          Support Local Artisans
        </span>

        <h1>
          Discover Unique
          <br />
          Handmade Treasures
        </h1>

        <p className="hero-description">
          Handcrafted Haven connects talented
          artisans with customers who appreciate
          creativity, quality, and sustainable
          handmade products. Every purchase
          supports skilled makers and celebrates
          authentic craftsmanship.
        </p>

        <div className="hero-buttons">
          {!user && (
            <>
              <Link
                href="/products"
                className="primary-btn"
              >
                Shop Now
              </Link>

              <Link
                href="/register"
                className="secondary-btn"
              >
                Become a Seller
              </Link>
            </>
          )}

          {user?.role === "buyer" && (
            <>
              <Link
                href="/products"
                className="primary-btn"
              >
                Shop Products
              </Link>

              <Link
                href="/cart"
                className="secondary-btn"
              >
                View My Cart
              </Link>
            </>
          )}

          {user?.role === "seller" && (
            <>
              <Link
                href="/products"
                className="primary-btn"
              >
                Manage Products
              </Link>

              <Link
                href="/products/add"
                className="secondary-btn"
              >
                Add Product
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="hero-image">
        <Image
          src="/images/hero/artisan-hero.png"
          alt="Artisan crafting handmade pottery"
          width={600}
          height={500}
          priority
        
        />
      </div>
    </section>
  );
}