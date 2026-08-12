import EditProductForm from "@/components/products/EditProductForm";

interface EditProductPageProps {
params: Promise<{
id: string;
}>;
}

export default async function EditProductPage({
params,
}: EditProductPageProps) {
const { id } = await params;

return ( <main> <section className="edit-product-header"> <h1>
Edit Product </h1>


    <p>
      Update your handcrafted product information.
    </p>
  </section>

  <EditProductForm
    productId={id}
  />
</main>

);
}
