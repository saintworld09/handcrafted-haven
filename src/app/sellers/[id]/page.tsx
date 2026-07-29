import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sellers } from "@/data/sellers";
import { products } from "@/data/products";

interface SellerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SellerPage({
  params,
}: SellerPageProps) {
  const { id } = await params;

  const seller = sellers.find(
    (item) => item.id === Number(id)
  );

  if (!seller) {
    notFound();
  }

  const sellerProducts = products.filter(
    (product) => product.sellerId === seller.id
  );

  return (
    <main className="seller-profile-page">

      <Link
        href="/sellers"
        className="back-link"
      >
        ← Back to Sellers
      </Link>

      <section className="seller-profile">

        <div className="seller-profile-image">

          <Image
            src={seller.image}
            alt={seller.name}
            width={500}
            height={500}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "15px",
            }}
          />

        </div>

        <div className="seller-profile-content">

          <span className="seller-specialty">
            {seller.specialty}
          </span>

          <h1>{seller.name}</h1>

          <p className="seller-location">
            📍 {seller.location}
          </p>

          <p className="seller-bio">
            {seller.bio}
          </p>

          <p className="seller-email">
            <strong>Email:</strong> {seller.email}
          </p>

          <Link
            href={`/sellers/contact/${seller.id}`}
            className="primary-btn"
            >
            Send Message
            </Link>

        </div>

      </section>

      <section className="seller-products">

        <h2>Products by {seller.name}</h2>

        <div className="seller-product-grid">

          {sellerProducts.map((product) => (

            <div
              className="seller-product-card"
              key={product.id}
            >

              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={220}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <div className="seller-product-content">

                <h3>{product.name}</h3>

                <p className="product-price">
                  ${product.price}
                </p>

                <Link
                  href={`/products/${product.id}`}
                  className="primary-btn"
                >
                  View Product
                </Link>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}