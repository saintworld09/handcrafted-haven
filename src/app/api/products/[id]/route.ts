import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/*
 * -------------------------------------------------
 * GET /api/products/[id]
 * -------------------------------------------------
 *
 * Public endpoint.
 *
 * Anyone can view a product.
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const product = await db
      .collection("products")
      .findOne({
        _id: new ObjectId(id),
      });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve product.",
      },
      { status: 500 }
    );
  }
}

/*
 * -------------------------------------------------
 * PUT /api/products/[id]
 * -------------------------------------------------
 *
 * Only authenticated sellers can update products.
 *
 * A seller can only update products that belong
 * to that seller.
 */
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    /*
     * 1. Get authenticated user
     */
    const currentUser =
      await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in to update a product.",
        },
        { status: 401 }
      );
    }

    /*
     * 2. Only sellers can update products
     */
    if (currentUser.role !== "seller") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only sellers can update products.",
        },
        { status: 403 }
      );
    }

    /*
     * 3. Validate product ID
     */
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    /*
     * 4. Connect to database
     */
    const client =
      await clientPromise;

    const db = client.db();

    /*
     * 5. Find existing product
     */
    const existingProduct =
      await db
        .collection("products")
        .findOne({
          _id: new ObjectId(id),
        });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    /*
     * 6. Verify ownership
     *
     * A seller cannot edit another seller's
     * product.
     */
    if (
      String(existingProduct.sellerId) !==
      currentUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to update this product.",
        },
        { status: 403 }
      );
    }

    /*
     * 7. Read request body
     */
    const body =
      await request.json();

    /*
     * 8. Prepare update data
     */
    const updateData:
      Record<string, unknown> = {
      updatedAt: new Date(),
    };

    /*
     * Product name
     */
    if (body.name !== undefined) {
      const name =
        String(body.name).trim();

      if (!name) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Product name cannot be empty.",
          },
          { status: 400 }
        );
      }

      updateData.name = name;
    }

    /*
     * Category
     */
    if (
      body.category !== undefined
    ) {
      const category =
        String(body.category).trim();

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Product category cannot be empty.",
          },
          { status: 400 }
        );
      }

      updateData.category =
        category;
    }

    /*
     * Price
     */
    if (body.price !== undefined) {
      const numericPrice =
        Number(body.price);

      if (
        Number.isNaN(numericPrice) ||
        numericPrice < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Price must be a valid positive number.",
          },
          { status: 400 }
        );
      }

      updateData.price =
        numericPrice;
    }

    /*
     * Image
     */
    if (body.image !== undefined) {
      const image =
        String(body.image).trim();

      if (!image) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Product image cannot be empty.",
          },
          { status: 400 }
        );
      }

      updateData.image = image;
    }

    /*
     * Description
     */
    if (
      body.description !== undefined
    ) {
      const description =
        String(
          body.description
        ).trim();

      if (!description) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Product description cannot be empty.",
          },
          { status: 400 }
        );
      }

      updateData.description =
        description;
    }

    /*
     * IMPORTANT:
     *
     * We intentionally do NOT accept:
     *
     * body.seller
     * body.sellerId
     *
     * This prevents a seller from changing
     * product ownership.
     */

    /*
     * 9. Update only the authenticated
     *    seller's product
     */
    const updateResult =
      await db
        .collection("products")
        .updateOne(
          {
            _id: new ObjectId(id),
            sellerId: currentUser.id,
          },
          {
            $set: updateData,
          }
        );

    if (
      updateResult.matchedCount === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to update this product.",
        },
        { status: 403 }
      );
    }

    /*
     * 10. Retrieve updated product
     */
    const updatedProduct =
      await db
        .collection("products")
        .findOne({
          _id: new ObjectId(id),
        });

    return NextResponse.json(
      {
        success: true,
        message:
          "Product updated successfully.",
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update product.",
      },
      { status: 500 }
    );
  }
}

/*
 * -------------------------------------------------
 * DELETE /api/products/[id]
 * -------------------------------------------------
 *
 * Only authenticated sellers can delete
 * their own products.
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    /*
     * 1. Get authenticated user
     */
    const currentUser =
      await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in to delete a product.",
        },
        { status: 401 }
      );
    }

    /*
     * 2. Only sellers can delete products
     */
    if (currentUser.role !== "seller") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only sellers can delete products.",
        },
        { status: 403 }
      );
    }

    /*
     * 3. Validate product ID
     */
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    /*
     * 4. Connect to database
     */
    const client =
      await clientPromise;

    const db = client.db();

    /*
     * 5. Delete only if the product belongs
     *    to the authenticated seller.
     */
    const result =
      await db
        .collection("products")
        .deleteOne({
          _id: new ObjectId(id),
          sellerId: currentUser.id,
        });

    /*
     * 6. Product was deleted
     */
    if (result.deletedCount === 1) {
      return NextResponse.json(
        {
          success: true,
          message:
            "Product deleted successfully.",
        },
        { status: 200 }
      );
    }

    /*
     * 7. Determine whether the product exists
     */
    const existingProduct =
      await db
        .collection("products")
        .findOne({
          _id: new ObjectId(id),
        });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    /*
     * 8. Product exists but belongs to
     *    another seller.
     */
    return NextResponse.json(
      {
        success: false,
        message:
          "You are not authorized to delete this product.",
      },
      { status: 403 }
    );
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete product.",
      },
      { status: 500 }
    );
  }
}