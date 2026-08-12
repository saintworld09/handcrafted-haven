import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/products
 *
 * Anyone can view products.
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    /*
     * Determine whether the current user is logged in.
     *
     * - Buyer: see all products
     * - Seller: see only their own products
     * - Not logged in: see all products
     */
    const currentUser = await getCurrentUser();

    const query =
      currentUser?.role === "seller"
        ? { sellerId: currentUser.id }
        : {};

    const products = await db
      .collection("products")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to retrieve products.",
      },
      { status: 500 }
    );
  }
}








/**
 * POST /api/products
 *
 * Only authenticated sellers can create products.
 */
export async function POST(request: Request) {
  try {
    /**
     * Get the authenticated user from
     * the HTTP-only session cookie.
     */
    const currentUser = await getCurrentUser();

    /**
     * User must be logged in.
     */
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to add a product.",
        },
        { status: 401 }
      );
    }

    /**
     * Only sellers can create products.
     */
    if (currentUser.role !== "seller") {
      return NextResponse.json(
        {
          success: false,
          message: "Only seller accounts can add products.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      name,
      category,
      price,
      image,
      description,
    } = body;

    /**
     * Convert text values to strings and trim them.
     */
    const productName = String(name ?? "").trim();
    const productCategory = String(category ?? "").trim();
    const productImage = String(image ?? "").trim();
    const productDescription = String(
      description ?? ""
    ).trim();

    /**
     * Validate required fields.
     */
    if (
      !productName ||
      !productCategory ||
      price === undefined ||
      !productImage ||
      !productDescription
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, category, price, image, and description are required.",
        },
        { status: 400 }
      );
    }

    /**
     * Validate price.
     */
    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Price must be a valid non-negative number.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    /**
     * IMPORTANT SECURITY RULE:
     *
     * Seller information comes from the
     * authenticated session.
     *
     * We do NOT accept seller or sellerId
     * from the browser.
     *
     * Therefore, a seller cannot pretend
     * to be another seller.
     */
    const newProduct = {
      name: productName,
      category: productCategory,
      price: numericPrice,
      image: productImage,
      seller: currentUser.name,
      sellerId: currentUser.id,
      description: productDescription,
      rating: 5,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("products")
      .insertOne(newProduct);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        product: {
          ...newProduct,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create product.",
      },
      { status: 500 }
    );
  }
}