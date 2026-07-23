import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-tagline">
          Support Local Artisans
        </p>

        <h1>
          Discover Unique
          <br />
          Handmade Treasures
        </h1>

        <p className="hero-description">
          Handcrafted Haven connects talented artisans with customers who
          appreciate creativity, quality, and sustainable handmade products.
          Every purchase supports skilled makers and celebrates authentic
          craftsmanship.
        </p>

        <div className="hero-buttons">
        <Link href="/products" className="primary-btn">
            Shop Now
        </Link>

        <Link href="/register" className="secondary-btn">
            Become a Seller
        </Link>
        </div>
      </div>

      <div className="hero-image">
        <Image
          src="/images/hero/artisan-hero.jfif"
          alt="Artisan crafting handmade pottery"
          width={600}
          height={500}
          priority
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "15px",
          }}
        />
      </div>
    </section>
  );
}