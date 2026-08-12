import Link from "next/link";

import { Seller } from "@/types/seller";

interface SellerCardProps {
  seller: Seller;
}

export default function SellerCard({
  seller,
}: SellerCardProps) {
  return (
    <div className="seller-card">
      <div className="seller-card-content">
        <h3>{seller.name}</h3>

        <p className="seller-specialty">
          Handcrafted Artisan
        </p>

        <p className="seller-location">
          📧 {seller.email}
        </p>

        <Link
          href={`/sellers/${seller.id}`}
          className="primary-btn"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}