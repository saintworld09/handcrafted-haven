"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function BuyerDashboard() {
  const router = useRouter();

  const { user } = useAuth();

  /*
   * -------------------------------------------------
   * Protect the buyer dashboard
   * -------------------------------------------------
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role !== "buyer") {
      router.replace("/dashboard/seller");
    }
  }, [user, router]);

  /*
   * Authentication is still being resolved.
   */
  if (!user) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-container">
          <div className="dashboard-loading">
            <div className="dashboard-spinner" />

            <p>
              Loading your dashboard...
            </p>
          </div>
        </section>
      </main>
    );
  }

  /*
   * Prevent buyer content from appearing
   * for a seller before redirect completes.
   */
  if (user.role !== "buyer") {
    return (
      <main className="dashboard-page">
        <section className="dashboard-container">
          <div className="dashboard-loading">
            <div className="dashboard-spinner" />

            <p>
              Redirecting to your dashboard...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-container">

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <p className="dashboard-label">
            Buyer Dashboard
          </p>

          <h1>
            Welcome, {user.name}!
          </h1>

          <p className="dashboard-description">
            Discover unique handcrafted products
            from talented artisans and manage your
            purchases.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="dashboard-grid">

          <Link
            href="/products"
            className="dashboard-card dashboard-card-primary"
          >
            <div className="dashboard-card-icon">
              🛍️
            </div>

            <div>
              <h2>Browse Products</h2>

              <p>
                Explore handcrafted products from
                our community of talented sellers.
              </p>
            </div>

            <span>
              View Products
              <strong>→</strong>
            </span>
          </Link>

          <Link
            href="/cart"
            className="dashboard-card dashboard-card-primary"
          >
            <div className="dashboard-card-icon">
              🛒
            </div>

            <div>
              <h2>My Cart</h2>

              <p>
                Review the products you have added
                to your shopping cart.
              </p>
            </div>

            <span>
              View Cart
              <strong>→</strong>
            </span>
          </Link>

          <div className="dashboard-card dashboard-card-disabled">
            <div className="dashboard-card-icon">
              📦
            </div>

            <div>
              <h2>My Orders</h2>

              <p>
                View your purchases and keep track
                of your orders.
              </p>
            </div>

            <span className="coming-soon">
              Coming Soon
            </span>
          </div>

          <div className="dashboard-card dashboard-card-disabled">
            <div className="dashboard-card-icon">
              👤
            </div>

            <div>
              <h2>My Profile</h2>

              <p>
                Manage your account information and
                personal details.
              </p>
            </div>

            <span className="coming-soon">
              Coming Soon
            </span>
          </div>

        </div>

        {/* Account Information */}
        <div className="dashboard-account">

          <div className="dashboard-account-header">
            <div className="dashboard-account-icon">
              👤
            </div>

            <div>
              <h2>Account Information</h2>

              <p>
                Your Handcrafted Haven account
                details.
              </p>
            </div>
          </div>

          <div className="dashboard-account-details">

            <div className="account-detail">
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>

            <div className="account-detail">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className="account-detail">
              <span>Account Type</span>

              <strong className="account-role">
                Buyer
              </strong>
            </div>

          </div>
        </div>

      </section>
    </main>
  );
}