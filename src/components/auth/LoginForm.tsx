"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(
        trimmedEmail,
        password
      );

      if (!success) {
        toast.error("Invalid email or password.");
        return;
      }

      toast.success(
        "Login successful! Welcome back."
      );

      /*
       * Get the authenticated user from the
       * server so we know which dashboard to open.
       *
       * We do not use localStorage here because
       * AuthContext already manages authentication.
       */
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (data.user?.role === "seller") {
        router.replace("/dashboard/seller");
      } else {
        router.replace("/dashboard/buyer");
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        "Something went wrong while logging in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-header">
          <p className="auth-brand">
            Handcrafted Haven
          </p>

          <h1>Welcome Back</h1>

          <p>
            Login to your Handcrafted Haven
            account and continue exploring
            unique handcrafted products.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          <div className="auth-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked
                  )
                }
              />

              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-password-btn"
              onClick={() =>
                toast.info(
                  "Password recovery will be available in a future milestone."
                )
              }
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="submit-product-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Signing In..."
              : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Do not have an account?{" "}

          <Link href="/register">
            Become a Seller
          </Link>
        </p>
      </div>
    </section>
  );
}