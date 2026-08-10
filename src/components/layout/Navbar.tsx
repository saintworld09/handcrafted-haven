"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="site-header">
      <nav className="navbar">
        <div className="navbar-container">
          <Link
            href="/"
            className="navbar-logo"
          >
            🧺 Handcrafted Haven
          </Link>

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

            <li>
              <Link
                href="/cart"
                className={
                  isActive("/cart")
                    ? "active-nav"
                    : ""
                }
              >
                 Cart
                {cartCount > 0
                  ? ` (${cartCount})`
                  : ""}
              </Link>
            </li>
          </ul>

          <div className="navbar-actions">
            {pathname === "/" && (
              <>
                <Link href="/login">
                  Login
                </Link>

                <Link
                  href="/register"
                  className="register-btn"
                >
                  Register
                </Link>
              </>
            )}

            {pathname === "/products" && (
              <Link
                href="/products/add"
                className="add-product-btn"
              >
                + Add Product
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}