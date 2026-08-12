import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getAuthCookieName } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore =
      await cookies();

    cookieStore.set(
      getAuthCookieName(),
      "",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      }
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Logged out successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Logout API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to log out.",
      },
      { status: 500 }
    );
  }
}