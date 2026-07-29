import ProductGrid from "@/components/products/ProductGrid";

export default function ProductsPage() {
  return (
    <main className="products-page">
      <section className="products-header">
        <h1>Handcrafted Products</h1>

        <p>
          Browse our carefully curated collection of handmade
          products created by talented artisans from around the
          world.
        </p>
      </section>

      <ProductGrid />
    </main>
  );
}