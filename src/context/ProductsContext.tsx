"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Product } from "@/types/product";
import { products as initialProducts } from "@/data/products";

type NewProduct = Omit<
  Product,
  "id" | "sellerId" | "rating" | "reviewCount"
>;

interface ProductsContextType {
  products: Product[];
  addProduct: (product: NewProduct) => void;
  updateProduct: (
    id: number,
    updatedProduct: Product
  ) => void;
  deleteProduct: (id: number) => void;
}

const ProductsContext = createContext<
  ProductsContextType | undefined
>(undefined);


export function ProductsProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [products, setProducts] =
    useState<Product[]>(() => {

      if (
        typeof window === "undefined"
      ) {
        return initialProducts;
      }


      const storedProducts =
        localStorage.getItem("products");


      if (storedProducts) {
        try {
          return JSON.parse(
            storedProducts
          );
        } catch (error) {
          console.error(
            "Failed to parse stored products:",
            error
          );

          return initialProducts;
        }
      }


      return initialProducts;
    });



  // Save products whenever products change
  useEffect(() => {

    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );

  }, [products]);



  function addProduct(
    product: NewProduct
  ) {

    const newProduct: Product = {
      ...product,
      id: Date.now(),
      sellerId: Date.now(),
      rating: 5,
      reviewCount: 0,
    };


    setProducts(
      (currentProducts) => [
        ...currentProducts,
        newProduct,
      ]
    );

  }


  function updateProduct(
  id: number,
  updatedProduct: Product
) {
  setProducts((currentProducts) =>
    currentProducts.map((product) =>
      product.id === id
        ? updatedProduct
        : product
    )
  );
}


function deleteProduct(id: number) {
  setProducts((currentProducts) =>
    currentProducts.filter(
      (product) => product.id !== id
    )
  );
}



  return (
    <ProductsContext.Provider
      value={{
        products,
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