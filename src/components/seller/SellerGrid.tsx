"use client";

import { useEffect, useState } from "react";

import SellerCard from "./SellerCard";
import { Seller } from "@/types/seller";

export default function SellerGrid() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSellers() {
      try {
        const response = await fetch("/api/sellers");

        if (!response.ok) {
          throw new Error("Unable to retrieve sellers.");
        }

        const data = await response.json();

        setSellers(data.sellers ?? []);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);

        setError(
          "Unable to load sellers. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSellers();
  }, []);

  if (loading) {
    return (
      <div className="seller-grid">
        <p>Loading sellers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-grid">
        <p>{error}</p>
      </div>
    );
  }

  if (sellers.length === 0) {
    return (
      <div className="seller-grid">
        <p>No sellers have registered yet.</p>
      </div>
    );
  }

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