"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  seller: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

const STORAGE_KEY = "cart";
const CART_EVENT = "cart-change";

/*
 * ------------------------------------------------------------------
 * Cart store
 * ------------------------------------------------------------------
 *
 * We keep the current cart in memory.
 *
 * IMPORTANT:
 * The initial value must be the same during server rendering
 * and the first client render. This prevents hydration errors.
 */

let cartSnapshot: CartItem[] = [];

const listeners = new Set<() => void>();

function notifyCartChange() {
  listeners.forEach((listener) => {
    listener();
  });
}

/*
 * Read the cart from localStorage.
 */
function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart: unknown = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart as CartItem[];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
}

/*
 * Get the current cart snapshot.
 *
 * React uses this function with useSyncExternalStore.
 */
function getCartSnapshot(): CartItem[] {
  return cartSnapshot;
}

/*
 * Server snapshot.
 *
 * This MUST remain stable and match the initial client snapshot.
 */
function getServerCartSnapshot(): CartItem[] {
  return cartSnapshot;
}

/*
 * Subscribe React to cart changes.
 */
function subscribeToCart(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/*
 * Update the in-memory cart and localStorage.
 */
function updateCart(newCart: CartItem[]) {
  cartSnapshot = newCart;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(newCart)
      );
    } catch (error) {
      console.error(
        "Failed to save cart to localStorage:",
        error
      );
    }

    window.dispatchEvent(new Event(CART_EVENT));
  }

  notifyCartChange();
}

/*
 * Listen for changes coming from another browser tab/window.
 */
function handleStorageChange(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) {
    return;
  }

  cartSnapshot = loadCartFromStorage();
  notifyCartChange();
}

/*
 * Listen for cart changes made inside this application.
 */
function handleCartChange() {
  cartSnapshot = loadCartFromStorage();
  notifyCartChange();
}

/*
 * ------------------------------------------------------------------
 * Cart Provider
 * ------------------------------------------------------------------
 */

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const cart = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot
  );

  /*
   * Load localStorage AFTER the initial render/hydration.
   *
   * We are not calling React setState here.
   * We are synchronizing the external cart store instead.
   */
  useEffect(() => {
    cartSnapshot = loadCartFromStorage();

    notifyCartChange();

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
   * Add a product to the cart.
   */
  function addToCart(
    product: Omit<CartItem, "quantity">
  ) {
    const currentCart = getCartSnapshot();

    const existingItem = currentCart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      updateCart(
        currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
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
   * Remove an item completely.
   */
  function removeFromCart(id: number) {
    const currentCart = getCartSnapshot();

    updateCart(
      currentCart.filter(
        (item) => item.id !== id
      )
    );
  }

  /*
   * Increase quantity by one.
   */
  function increaseQuantity(id: number) {
    const currentCart = getCartSnapshot();

    updateCart(
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  /*
   * Decrease quantity by one.
   *
   * If quantity reaches zero, remove the item.
   */
  function decreaseQuantity(id: number) {
    const currentCart = getCartSnapshot();

    updateCart(
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  }

  /*
   * Empty the entire cart.
   */
  function clearCart() {
    updateCart([]);
  }

  /*
   * Total number of products in the cart.
   */
  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cart]);

  /*
   * Total price of everything in the cart.
   */
  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
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
 * ------------------------------------------------------------------
 * useCart Hook
 * ------------------------------------------------------------------
 */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}