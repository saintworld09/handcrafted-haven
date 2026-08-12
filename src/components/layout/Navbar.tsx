"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  const dashboardHref =
    user?.role === "seller"
      ? "/dashboard/seller"
      : "/dashboard/buyer";

  return (
    <header className="site-header">
      <nav className="navbar">
        <div className="navbar-container">

          {/* Brand */}
          <Link
            href="/"
            className="navbar-logo"
            aria-label="Handcrafted Haven home"
          >
            <span className="navbar-logo-icon">
              🧺
            </span>

            <span className="navbar-logo-text">
              Handcrafted
              <span>Haven</span>
            </span>
          </Link>

          {/* Main Navigation */}
          <ul className="nav-links">

            <li>
              <Link
                href="/"
                className={
                  isActive("/")
                    ? "active-nav"
                    : ""
                }
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/products"
                className={
                  isActive("/products")
                    ? "active-nav"
                    : ""
                }
              >
                Products
              </Link>
            </li>

            <li>
              <Link
                href="/sellers"
                className={
                  isActive("/sellers")
                    ? "active-nav"
                    : ""
                }
              >
                Sellers
              </Link>
            </li>

            <li>
              <Link
                href="/about"
                className={
                  isActive("/about")
                    ? "active-nav"
                    : ""
                }
              >
                About
              </Link>
            </li>

            {user?.role === "buyer" && (
              <li>
                <Link
                  href="/cart"
                  className={`cart-nav-link ${
                    isActive("/cart")
                      ? "active-nav"
                      : ""
                  }`}
                >
                  <span>Cart</span>

                  {cartCount > 0 && (
                    <span className="cart-badge">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            )}

          </ul>

          {/* User Actions */}
          <div className="navbar-actions">

            {!user ? (
              <>
                <Link
                  href="/login"
                  className="login-link"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="register-btn"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={dashboardHref}
                  className="user-nav-link"
                >
                  <span className="user-avatar">
                    {user.name
                      ? user.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}
                  </span>

                  <span className="user-name">
                    {user.name}
                  </span>
                </Link>

                {user.role === "seller" && (
                  <Link
                    href="/products/add"
                    className="add-product-btn"
                  >
                    <span>+</span>
                    Add Product
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div>
      </nav>
    </header>
  );
}