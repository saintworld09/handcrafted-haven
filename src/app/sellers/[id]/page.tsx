import SellerProfileClient from "@/components/seller/SellerProfileClient";

interface SellerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SellerPage({
  params,
}: SellerPageProps) {
  const { id } = await params;

  return <SellerProfileClient id={id} />;
}