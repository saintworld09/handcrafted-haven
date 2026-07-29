import Image from "next/image";
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
      <Image
        src={seller.image}
        alt={seller.name}
        width={400}
        height={300}
        style={{
          width: "100%",
          height: "250px",
          objectFit: "cover",
        }}
      />

      <div className="seller-card-content">
        <h3>{seller.name}</h3>

        <p className="seller-specialty">
          {seller.specialty}
        </p>

        <p className="seller-location">
          📍 {seller.location}
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