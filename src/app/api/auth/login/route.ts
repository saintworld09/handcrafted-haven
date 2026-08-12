import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import clientPromise from "@/lib/mongodb";

import {
  createSessionToken,
  getAuthCookieName,
} from "@/lib/auth";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const email = String(
      body.email ?? ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      body.password ?? ""
    );

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const client =
      await clientPromise;

    const db = client.db();

    const user =
      await db
        .collection("users")
        .findOne({
          email,
        });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    /**
     * Passwords are stored as bcrypt hashes.
     *
     * Therefore we MUST use bcrypt.compare()
     * instead of comparing the strings directly.
     */
    const passwordIsValid =
      await bcrypt.compare(
        password,
        String(user.password)
      );

    if (!passwordIsValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    /**
     * Only allow the two roles supported
     * by the application.
     */
    const role =
      user.role === "seller"
        ? "seller"
        : user.role === "buyer"
        ? "buyer"
        : null;

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid user role.",
        },
        { status: 403 }
      );
    }

    const authenticatedUser = {
      id: user._id.toString(),
      name: String(user.name),
      email: String(user.email),
      role,
    } as const;

    /**
     * Create the server-side session token.
     */
    const token =
      createSessionToken(
        authenticatedUser
      );

    /**
     * Store the session in an HTTP-only
     * cookie.
     *
     * JavaScript cannot access this cookie.
     */
    const cookieStore =
      await cookies();

    cookieStore.set(
      getAuthCookieName(),
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        maxAge:
          60 * 60 * 24 * 7,
      }
    );

    return NextResponse.json(
      {
        success: true,
        user: authenticatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Login API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to log in. Please try again.",
      },
      { status: 500 }
    );
  }
}
