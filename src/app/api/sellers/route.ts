import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const sellers = await db
      .collection("users")
      .find(
        { role: "seller" },
        {
          projection: {
            password: 0,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    const formattedSellers = sellers.map((seller) => ({
      id: seller._id.toString(),
      name: seller.name,
      email: seller.email,
      role: "seller",
    }));

    return NextResponse.json(
      {
        success: true,
        sellers: formattedSellers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get sellers error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve sellers.",
      },
      { status: 500 }
    );
  }
}