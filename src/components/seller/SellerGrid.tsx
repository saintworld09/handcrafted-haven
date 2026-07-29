import SellerCard from "./SellerCard";
import { sellers } from "@/data/sellers";

export default function SellerGrid() {
  return (
    <div className="seller-grid">
      {sellers.map((seller) => (
        <SellerCard
          key={seller.id}
          seller={seller}
        />
      ))}
    </div>
  );
}