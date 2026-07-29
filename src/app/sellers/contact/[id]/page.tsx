import Link from "next/link";
import { notFound } from "next/navigation";
import { sellers } from "@/data/sellers";

interface ContactPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContactSellerPage({
  params,
}: ContactPageProps) {
  const { id } = await params;

  const seller = sellers.find(
    (item) => item.id === Number(id)
  );

  if (!seller) {
    notFound();
  }

  return (
    <main className="contact-page">

      <Link
        href={`/sellers/${seller.id}`}
        className="back-link"
      >
        ← Back to Seller
      </Link>

      <section className="contact-card">

        <h1>Contact {seller.name}</h1>

        <p>
          Send a message to discuss this handcrafted product,
          request customizations, or ask any questions before
          placing an order.
        </p>

        <div className="contact-details">

          <p>
            <strong>Email:</strong> {seller.email}
          </p>

          <p>
            <strong>Phone:</strong> {seller.phone}
          </p>

        </div>

        <form className="contact-form">

          <label>Your Name</label>

          <input
            type="text"
            placeholder="Enter your name"
          />

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Your Message</label>

          <textarea
            rows={6}
            placeholder="Write your message..."
          />

          <button
            type="submit"
            className="primary-btn"
          >
            Send Message
          </button>

        </form>

      </section>

    </main>
  );
}