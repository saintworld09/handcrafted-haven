import Link from "next/link";
export default function CallToAction() {
  return (
    <section className="cta">
      <h2>Become a Seller</h2>

      <p>
        Share your handcrafted creations with customers who appreciate unique,
        high-quality handmade products.
      </p>

      <Link href="/register" className="cta-btn">
  Join Our Marketplace
</Link>

    </section>
  );
}