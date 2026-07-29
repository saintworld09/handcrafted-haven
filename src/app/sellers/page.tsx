import SellerGrid from "@/components/seller/SellerGrid";

export default function SellersPage() {
  return (
    <main className="sellers-page">
      <section className="sellers-header">
        <h1>Meet Our Artisans</h1>

        <p>
          Discover talented creators from across Africa,
          each bringing unique skills, passion, and
          craftsmanship to Handcrafted Haven.
        </p>
      </section>

      <SellerGrid />
    </main>
  );
}