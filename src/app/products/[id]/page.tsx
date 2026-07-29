import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ProductReviews from "@/components/products/ProductReviews";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    notFound();
  }

  return (
    <main className="product-details-page">
      <Link href="/products" className="back-link">
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
            Crafted by <strong>{product.seller}</strong>
          </p>

          <h2 className="product-price">
            ${product.price}
          </h2>

          <Link
            href={`/sellers/${product.sellerId}`}
            className="primary-btn"
            >
            Contact Seller
            </Link>
        </div>
      </div>
      <ProductReviews />
    </main>
  );
}