"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RegisteredUser {
  name: string;
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [rememberMe, setRememberMe] =
    useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedEmail =
      email.trim().toLowerCase();

    if (!trimmedEmail) {
      toast.error(
        "Please enter your email address."
      );
      return;
    }

    if (!password) {
      toast.error(
        "Please enter your password."
      );
      return;
    }

    setIsSubmitting(true);

    const storedUser =
      localStorage.getItem(
        "handcrafted-haven-user"
      );

    if (!storedUser) {
      toast.error(
        "No account was found. Please register first."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const user: RegisteredUser =
        JSON.parse(storedUser);

      if (
        user.email !== trimmedEmail ||
        user.password !== password
      ) {
        toast.error(
          "Invalid email or password."
        );
        setIsSubmitting(false);
        return;
      }

      const session = {
        name: user.name,
        email: user.email,
        loggedIn: true,
      };

      if (rememberMe) {
        localStorage.setItem(
          "handcrafted-haven-session",
          JSON.stringify(session)
        );
      } else {
        sessionStorage.setItem(
          "handcrafted-haven-session",
          JSON.stringify(session)
        );
      }

      toast.success(
        `Welcome back, ${user.name}!`
      );

      setEmail("");
      setPassword("");
      setIsSubmitting(false);

      router.push("/products");
    } catch (error) {
      console.error(
        "Failed to read user account:",
        error
      );

      toast.error(
        "Something went wrong. Please register again."
      );

      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="section-label">
            Handcrafted Haven
          </span>

          <h1>Welcome Back</h1>

          <p>
            Login to your seller account and
            continue managing your handcrafted
            products.
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