import Link from "next/link";

import { Seller } from "@/types/seller";

interface ContactSellerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContactSellerPage({
  params,
}: ContactSellerPageProps) {
  const { id } = await params;

  let seller: Seller | null = null;

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/sellers`,
      {
        cache: "no-store",
      }
    );

    if (response.ok) {
      const data = await response.json();

      seller =
        data.sellers?.find(
          (item: Seller) => item.id === id
        ) ?? null;
    }
  } catch (error) {
    console.error(
      "Failed to retrieve seller:",
      error
    );
  }

  if (!seller) {
    return (
      <main className="product-not-found">
        <h1>Seller Not Found</h1>

        <p>
          Sorry, we could not find this seller.
        </p>

        <Link
          href="/sellers"
          className="primary-btn"
        >
          ← Back to Sellers
        </Link>
      </main>
    );
  }

  return (
    <main className="seller-contact-page">
      <Link
        href="/sellers"
        className="back-link"
      >
        ← Back to Sellers
      </Link>

      <section className="seller-contact-container">
        <h1>Contact {seller.name}</h1>

        <p>
          If you have questions about products from{" "}
          <strong>{seller.name}</strong>, you can
          contact the seller using the information
          below.
        </p>

        <div className="seller-contact-info">
          <p>
            <strong>Name:</strong>{" "}
            {seller.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${seller.email}`}
            >
              {seller.email}
            </a>
          </p>
        </div>

        <div className="seller-contact-actions">
          <a
            href={`mailto:${seller.email}`}
            className="primary-btn"
          >
            ✉️ Email Seller
          </a>

          <Link
            href={`/sellers/${seller.id}`}
            className="secondary-btn"
          >
            View Seller Profile
          </Link>
        </div>
      </section>
    </main>
  );
}