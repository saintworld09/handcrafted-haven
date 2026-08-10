"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/context/CartContext";

export default function CartPageClient() {
  const {
    cart,
    cartTotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  /* ---------------- Empty Cart ---------------- */

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <section className="cart-header">
          <div>
            <p className="cart-eyebrow">YOUR SHOPPING BAG</p>
            <h1>Shopping Cart</h1>
            <p className="cart-description">
              Review the handmade pieces you have selected.
            </p>
          </div>
        </section>

        <section className="empty-cart-card">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            You haven&apos;t added any handcrafted products to your
            cart yet. Explore our collection and find something
            special.
          </p>

          <Link
            href="/products"
            className="primary-btn"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  /* ---------------- Cart ---------------- */

  return (
    <main className="cart-page">
      {/* Page Header */}
      <section className="cart-header">
        <div>
          <p className="cart-eyebrow">YOUR SHOPPING BAG</p>

          <h1>Shopping Cart</h1>

          <p className="cart-description">
            Review your handcrafted selections before checkout.
          </p>
        </div>

        <button
          type="button"
          className="clear-cart-btn"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </section>

      <div className="cart-layout">
        {/* Cart Items */}
        <section className="cart-items-section">
          <div className="cart-items-header">
            <h2>Your Items</h2>

            <span>
              {cart.reduce(
                (total, item) => total + item.quantity,
                0
              )}{" "}
              items
            </span>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <article
                key={item.id}
                className="cart-item"
              >
                {/* Product Image */}
                <div className="cart-item-image">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={140}
                    height={140}
                  />
                </div>

                {/* Product Details */}
                <div className="cart-item-details">
                  <p className="cart-item-seller">
                    {item.seller}
                  </p>

                  <h3>{item.name}</h3>

                  <p className="cart-item-price">
                    ${item.price.toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="cart-quantity">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="cart-item-actions">
                  <p className="cart-item-subtotal">
                    $
                    {(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </p>

                  <button
                    type="button"
                    className="remove-cart-item"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <Link
            href="/products"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>
        </section>

        {/* Order Summary */}
        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>

            <span>
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>

            <span>Free</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ${cartTotal.toFixed(2)}
            </strong>
          </div>

          <button
            type="button"
            className="checkout-btn"
          >
            Proceed to Checkout
          </button>

          <p className="secure-checkout">
            🔒 Secure checkout
          </p>
        </aside>
      </div>
    </main>
  );
}
