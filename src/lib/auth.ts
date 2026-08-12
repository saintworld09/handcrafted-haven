import crypto from "crypto";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller";
};

const AUTH_COOKIE_NAME =
  "handcrafted_haven_session";

const SESSION_DURATION =
  1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not defined in .env.local"
    );
  }

  return secret;
}

function encode(value: string) {
  return Buffer.from(value).toString(
    "base64url"
  );
}

function decode(value: string) {
  return Buffer.from(
    value,
    "base64url"
  ).toString("utf8");
}

function createSignature(
  payload: string
) {
  return crypto
    .createHmac(
      "sha256",
      getSecret()
    )
    .update(payload)
    .digest("base64url");
}

/**
 * Create a signed session token.
 *
 * The token is stored in an HTTP-only cookie.
 */
export function createSessionToken(
  user: AuthUser
) {
  const payload = encode(
    JSON.stringify({
      ...user,
      expiresAt:
        Date.now() + SESSION_DURATION,
    })
  );

  const signature =
    createSignature(payload);

  return `${payload}.${signature}`;
}

/**
 * Verify that a session token:
 *
 * 1. Has the correct format
 * 2. Has a valid signature
 * 3. Has not expired
 * 4. Contains valid user information
 */
export function verifySessionToken(
  token: string
): AuthUser | null {
  try {
    const [
      payload,
      signature,
    ] = token.split(".");

    if (!payload || !signature) {
      return null;
    }

    const expectedSignature =
      createSignature(payload);

    const signatureBuffer =
      Buffer.from(signature);

    const expectedBuffer =
      Buffer.from(
        expectedSignature
      );

    if (
      signatureBuffer.length !==
        expectedBuffer.length ||
      !crypto.timingSafeEqual(
        signatureBuffer,
        expectedBuffer
      )
    ) {
      return null;
    }

    const session = JSON.parse(
      decode(payload)
    );

    if (
      !session.expiresAt ||
      Date.now() > session.expiresAt
    ) {
      return null;
    }

    if (
      session.role !== "buyer" &&
      session.role !== "seller"
    ) {
      return null;
    }

    if (
      typeof session.id !== "string" ||
      typeof session.name !== "string" ||
      typeof session.email !== "string"
    ) {
      return null;
    }

    return {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
    };
  } catch (error) {
    console.error(
      "Session verification error:",
      error
    );

    return null;
  }
}

/**
 * Get the name of the authentication cookie.
 */
export function getAuthCookieName() {
  return AUTH_COOKIE_NAME;
}

/**
 * Get the currently authenticated user.
 *
 * First checks the signed HTTP-only cookie.
 * Then checks MongoDB to make sure the user
 * still exists and that the role is still valid.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore =
      await cookies();

    const token =
      cookieStore.get(
        AUTH_COOKIE_NAME
      )?.value;

    if (!token) {
      return null;
    }

    const sessionUser =
      verifySessionToken(token);

    if (!sessionUser) {
      return null;
    }

    if (
      !ObjectId.isValid(
        sessionUser.id
      )
    ) {
      return null;
    }

    const client =
      await clientPromise;

    const db = client.db();

    const user =
      await db
        .collection("users")
        .findOne(
          {
            _id: new ObjectId(
              sessionUser.id
            ),
          },
          {
            projection: {
              password: 0,
            },
          }
        );

    if (!user) {
      return null;
    }

    if (
      user.role !== "buyer" &&
      user.role !== "seller"
    ) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: String(user.name),
      email: String(user.email),
      role:
        user.role === "seller"
          ? "seller"
          : "buyer",
    };
  } catch (error) {
    console.error(
      "Unable to get current user:",
      error
    );

    return null;
  }
}