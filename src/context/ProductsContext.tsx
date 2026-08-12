"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Product } from "@/types/product";

type NewProduct = Omit<
  Product,
  "id" | "rating" | "reviewCount"
>;

interface ApiProduct {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  image: string;
  seller: string;
  sellerId?: string;
  description: string;
  rating?: number;
  reviewCount?: number;
}

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  error: string;

  addProduct: (product: NewProduct) => Promise<void>;

  updateProduct: (
    id: string,
    updatedProduct: Product
  ) => Promise<void>;

  deleteProduct: (id: string) => Promise<void>;
}

const ProductsContext = createContext<
  ProductsContextType | undefined
>(undefined);

function normalizeProduct(
  product: ApiProduct
): Product {
  return {
    id: product._id ?? product.id ?? "",
    name: product.name,
    category: product.category,
    price: Number(product.price),
    image: product.image,
    seller: product.seller,
    sellerId: product.sellerId ?? "",
    description: product.description,
    rating: Number(product.rating ?? 5),
    reviewCount: Number(
      product.reviewCount ?? 0
    ),
  };
}

export function ProductsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  /*
   * -------------------------------------------------
   * Load Products
   * -------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch(
          "/api/products",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data: {
          success?: boolean;
          products?: ApiProduct[];
          message?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load products."
          );
        }

        if (cancelled) {
          return;
        }

        const loadedProducts =
          Array.isArray(data.products)
            ? data.products.map(
                normalizeProduct
              )
            : [];

        setProducts(loadedProducts);
        setError("");
        setIsLoading(false);
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error
        );

        if (cancelled) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load products."
        );

        setIsLoading(false);
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * -------------------------------------------------
   * Add Product
   * -------------------------------------------------
   */

  async function addProduct(
    product: NewProduct
  ): Promise<void> {
    try {
      setError("");

      const response = await fetch(
        "/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            description:
              product.description,
          }),
        }
      );

      const data: {
        success?: boolean;
        product?: ApiProduct;
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create product."
        );
      }

      if (!data.product) {
        throw new Error(
          "The server did not return the created product."
        );
      }

      const newProduct =
        normalizeProduct(data.product);

      setProducts(
        (currentProducts) => [
          ...currentProducts,
          newProduct,
        ]
      );
    } catch (error) {
      console.error(
        "Failed to add product:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to add product.";

      setError(message);

      throw error;
    }
  }

  /*
   * -------------------------------------------------
   * Update Product
   * -------------------------------------------------
   */

  async function updateProduct(
    id: string,
    updatedProduct: Product
  ): Promise<void> {
    try {
      setError("");

      const response = await fetch(
        `/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          /*
           * Do NOT send seller or sellerId.
           *
           * The API determines ownership from
           * the authenticated session.
           */
          body: JSON.stringify({
            name: updatedProduct.name,
            category:
              updatedProduct.category,
            price: updatedProduct.price,
            image: updatedProduct.image,
            description:
              updatedProduct.description,
          }),
        }
      );

      const data: {
        success?: boolean;
        product?: ApiProduct;
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update product."
        );
      }

      if (!data.product) {
        throw new Error(
          "The server did not return the updated product."
        );
      }

      const normalizedProduct =
        normalizeProduct(data.product);

      setProducts(
        (currentProducts) =>
          currentProducts.map(
            (product) =>
              product.id === id
                ? normalizedProduct
                : product
          )
      );
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update product.";

      setError(message);

      throw error;
    }
  }

  /*
   * -------------------------------------------------
   * Delete Product
   * -------------------------------------------------
   */

  async function deleteProduct(
    id: string
  ): Promise<void> {
    try {
      setError("");

      const response = await fetch(
        `/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete product."
        );
      }

      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (product) =>
              product.id !== id
          )
      );
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete product.";

      setError(message);

      throw error;
    }
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context =
    useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductsProvider"
    );
  }

  return context;
}
