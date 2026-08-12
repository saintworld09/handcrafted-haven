import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

import {
  createSessionToken,
  getAuthCookieName,
} from "@/lib/auth";

import type { UserRole } from "@/models/User";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      name,
      email,
      password,
      role,
    } = body;

    /**
     * Validate required fields.
     */
    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, email, password, and role are required.",
        },
        { status: 400 }
      );
    }

    /**
     * Validate role.
     */
    if (
      role !== "buyer" &&
      role !== "seller"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Role must be either buyer or seller.",
        },
        { status: 400 }
      );
    }

    const trimmedName =
      String(name).trim();

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    const plainPassword =
      String(password);

    /**
     * Validate name.
     */
    if (trimmedName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name must be at least 2 characters long.",
        },
        { status: 400 }
      );
    }

    /**
     * Basic email validation.
     */
    if (
      !normalizedEmail.includes(
        "@"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    /**
     * Validate password.
     */
    if (
      plainPassword.length < 6
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    /**
     * Connect to MongoDB.
     */
    const client =
      await clientPromise;

    const db = client.db();

    const usersCollection =
      db.collection("users");

    /**
     * Check whether this email
     * already exists.
     */
    const existingUser =
      await usersCollection.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    /**
     * Hash the password before storing it.
     */
    const hashedPassword =
      await bcrypt.hash(
        plainPassword,
        12
      );

    /**
     * Create the database user.
     */
    const newUser = {
      _id: new ObjectId(),
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: role as UserRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(
      newUser
    );

    /**
     * Never send the password to the browser.
     */
    const authenticatedUser = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    /**
     * Automatically authenticate the
     * newly registered user.
     */
    const token =
      createSessionToken(
        authenticatedUser
      );

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
        message:
          "Account created successfully.",
        user: authenticatedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while creating the account.",
      },
      { status: 500 }
    );
  }
}