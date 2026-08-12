
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function SellerDashboard() {
  const router = useRouter();

  const { user } = useAuth();

  /*
   * -------------------------------------------------
   * Protect the seller dashboard
   * -------------------------------------------------
   */

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "seller") {
      router.replace("/dashboard/buyer");
    }
  }, [user, router]);

  /*
   * While authentication is being resolved,
   * don't render seller information.
   */

  if (!user) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-container">
          <p>Checking your account...</p>
        </section>
      </main>
    );
  }

  /*
   * Prevent buyer content from briefly appearing
   * before the redirect completes.
   */

  if (user.role !== "seller") {
    return (
      <main className="dashboard-page">
        <section className="dashboard-container">
          <p>
            Redirecting to your dashboard...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-container">
        <div className="dashboard-header">
  <p className="dashboard-label">
    Seller Dashboard
  </p>

  <h1>
    Welcome
    {user.name
      ? `, ${user.name}`
      : ""}
    !
  </h1>

          <p>
            Manage your seller account,
            showcase your handcrafted
            products, and keep track of
            your sales.
          </p>
        </div>

        <div className="dashboard-grid">
          <Link
            href="/products"
            className="dashboard-card"
          >
            <h2>My Products</h2>

            <p>
              View the products currently
              available in your storefront.
            </p>

            <span>
              View Products →
            </span>
          </Link>

          <Link
            href="/products/add"
            className="dashboard-card"
          >
            <h2>Add Product</h2>

            <p>
              Add a new handcrafted product
              to your storefront.
            </p>

            <span>
              Add Product →
            </span>
          </Link>

          <div className="dashboard-card">
            <h2>Orders</h2>

            <p>
              Review customer orders and
              keep track of your sales.
            </p>

            <span>
              Coming Soon
            </span>
          </div>

          <div className="dashboard-card">
            <h2>Seller Profile</h2>

            <p>
              Manage your seller information
              and storefront details.
            </p>

            <span>
              Coming Soon
            </span>
          </div>
        </div>

        <div className="dashboard-account">
          <h2>Account Information</h2>

          <p>
            <strong>Name:</strong>{" "}
            {user.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user.email}
          </p>

          <p>
            <strong>
              Account Type:
            </strong>{" "}
            Seller
          </p>
        </div>
      </section>
    </main>
  );
}

