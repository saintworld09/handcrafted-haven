"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import { useAuth } from "@/context/AuthContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Omit<CartItem, "quantity">
  ) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

const CART_EVENT = "cart-change";

const GUEST_CART_KEY = "handcrafted-haven-guest-cart";

/*
 * -------------------------------------------------
 * Cart Store
 * -------------------------------------------------
 *
 * Authentication is NOT stored here.
 *
 * AuthContext gets the authenticated user from
 * the HTTP-only authentication session.
 *
 * We only use the authenticated user's database
 * ID to give each buyer their own cart.
 * -------------------------------------------------
 */

let activeUserId: string | null = null;

let cartSnapshot: CartItem[] = [];

const listeners = new Set<() => void>();

/*
 * -------------------------------------------------
 * Storage Key
 * -------------------------------------------------
 */

function getCartStorageKey(
  userId: string | null
): string {
  if (!userId) {
    return GUEST_CART_KEY;
  }

  return `handcrafted-haven-cart-${userId}`;
}

/*
 * -------------------------------------------------
 * Cart Item Validation
 * -------------------------------------------------
 */

function isCartItem(
  value: unknown
): value is CartItem {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const item =
    value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.image === "string" &&
    typeof item.seller === "string" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

/*
 * -------------------------------------------------
 * Load Cart
 * -------------------------------------------------
 */

function loadCartFromStorage(
  userId: string | null
): CartItem[] {
  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  /*
   * Visitors and sellers should never have
   * an active shopping cart.
   */

  if (!userId) {
    return [];
  }

  try {
    const storageKey =
      getCartStorageKey(userId);

    const storedCart =
      window.localStorage.getItem(
        storageKey
      );

    if (!storedCart) {
      return [];
    }

    const parsedCart: unknown =
      JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter(isCartItem);
  } catch (error) {
    console.error(
      "Failed to load cart:",
      error
    );

    return [];
  }
}

/*
 * -------------------------------------------------
 * Get Cart Snapshot
 * -------------------------------------------------
 */

function getCartSnapshot(): CartItem[] {
  return cartSnapshot;
}

/*
 * -------------------------------------------------
 * Server Snapshot
 * -------------------------------------------------
 *
 * Always empty during server rendering.
 * This prevents hydration problems.
 * -------------------------------------------------
 */

const EMPTY_CART: CartItem[] = [];

function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

/*
 * -------------------------------------------------
 * Subscribe
 * -------------------------------------------------
 */

function subscribeToCart(
  listener: () => void
) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/*
 * -------------------------------------------------
 * Notify Listeners
 * -------------------------------------------------
 */

function notifyCartChange() {
  listeners.forEach((listener) => {
    listener();
  });
}

/*
 * -------------------------------------------------
 * Update Cart
 * -------------------------------------------------
 */

function updateCart(
  newCart: CartItem[]
) {
  cartSnapshot = newCart;

  /*
   * Never save a cart for a visitor.
   */

  if (
    typeof window !== "undefined" &&
    activeUserId
  ) {
    try {
      const storageKey =
        getCartStorageKey(
          activeUserId
        );

      window.localStorage.setItem(
        storageKey,
        JSON.stringify(newCart)
      );

      window.dispatchEvent(
        new Event(CART_EVENT)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }

  notifyCartChange();
}

/*
 * -------------------------------------------------
 * Change Active User
 * -------------------------------------------------
 *
 * Called when the authenticated user changes.
 *
 * This is the key part that prevents one buyer's
 * cart from appearing for another buyer.
 * -------------------------------------------------
 */

function switchCartUser(
  userId: string | null
) {
  activeUserId = userId;

  /*
   * Only buyers should have a cart.
   *
   * AuthContext gives us the user ID, but the role
   * is handled by the provider below.
   */

  cartSnapshot =
    loadCartFromStorage(userId);

  notifyCartChange();
}

/*
 * -------------------------------------------------
 * Storage Event
 * -------------------------------------------------
 *
 * Handles changes from another browser tab.
 * -------------------------------------------------
 */

function handleStorageChange(
  event: StorageEvent
) {
  if (!activeUserId) {
    return;
  }

  const expectedKey =
    getCartStorageKey(
      activeUserId
    );

  if (event.key !== expectedKey) {
    return;
  }

  cartSnapshot =
    loadCartFromStorage(
      activeUserId
    );

  notifyCartChange();
}

/*
 * -------------------------------------------------
 * Application Cart Event
 * -------------------------------------------------
 */

function handleCartChange() {
  if (!activeUserId) {
    return;
  }

  cartSnapshot =
    loadCartFromStorage(
      activeUserId
    );

  notifyCartChange();
}

/*
 * -------------------------------------------------
 * Cart Provider
 * -------------------------------------------------
 */

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  /*
   * Only buyers receive a shopping cart.
   */

  const buyerId =
    user?.role === "buyer"
      ? user.id
      : null;

  const cart =
    useSyncExternalStore(
      subscribeToCart,
      getCartSnapshot,
      getServerCartSnapshot
    );

  /*
   * Synchronize the external cart store whenever
   * the authenticated buyer changes.
   *
   * This is NOT authentication state.
   * Authentication continues to come from AuthContext.
   */

  useEffect(() => {
    switchCartUser(buyerId);
  }, [buyerId]);

  /*
   * Register browser event listeners.
   */

  useEffect(() => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      CART_EVENT,
      handleCartChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        CART_EVENT,
        handleCartChange
      );
    };
  }, []);

  /*
   * -------------------------------------------------
   * Add Product
   * -------------------------------------------------
   */

  function addToCart(
    product: Omit<CartItem, "quantity">
  ) {
    /*
     * Only authenticated buyers can add
     * products to the cart.
     */

    if (!user) {
      throw new Error(
        "Please log in as a buyer to add products to your cart."
      );
    }

    if (user.role !== "buyer") {
      throw new Error(
        "Only buyer accounts can add products to the cart."
      );
    }

    /*
     * Make sure the cart belongs to the
     * authenticated buyer.
     */

    if (activeUserId !== user.id) {
      switchCartUser(user.id);
    }

    const currentCart =
      getCartSnapshot();

    const existingItem =
      currentCart.find(
        (item) =>
          item.id === product.id
      );

    if (existingItem) {
      updateCart(
        currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );

      return;
    }

    updateCart([
      ...currentCart,
      {
        ...product,
        quantity: 1,
      },
    ]);
  }

  /*
   * -------------------------------------------------
   * Remove Product
   * -------------------------------------------------
   */

  function removeFromCart(
    id: string
  ) {
    if (!buyerId) {
      return;
    }

    const currentCart =
      getCartSnapshot();

    updateCart(
      currentCart.filter(
        (item) =>
          item.id !== id
      )
    );
  }

  /*
   * -------------------------------------------------
   * Increase Quantity
   * -------------------------------------------------
   */

  function increaseQuantity(
    id: string
  ) {
    if (!buyerId) {
      return;
    }

    const currentCart =
      getCartSnapshot();

    updateCart(
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  }

  /*
   * -------------------------------------------------
   * Decrease Quantity
   * -------------------------------------------------
   */

  function decreaseQuantity(
    id: string
  ) {
    if (!buyerId) {
      return;
    }

    const currentCart =
      getCartSnapshot();

    updateCart(
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }

  /*
   * -------------------------------------------------
   * Clear Cart
   * -------------------------------------------------
   */

  function clearCart() {
    if (!buyerId) {
      return;
    }

    updateCart([]);
  }

  /*
   * -------------------------------------------------
   * Cart Count
   * -------------------------------------------------
   */

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cart]);

  /*
   * -------------------------------------------------
   * Cart Total
   * -------------------------------------------------
   */

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/*
 * -------------------------------------------------
 * useCart Hook
 * -------------------------------------------------
 */

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}