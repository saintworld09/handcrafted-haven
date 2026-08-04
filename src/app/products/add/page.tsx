import AddProductForm from "@/components/products/AddProductForm";

export default function AddProductPage() {
  return (
    <main className="add-product-page">
      <section className="add-product-header">
        <h1>Add New Product</h1>

        <p>
          Share your handcrafted creation with customers from around the world.
        </p>
      </section>

      <AddProductForm />
    </main>
  );
}