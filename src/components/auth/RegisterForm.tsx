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

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail =
      email.trim().toLowerCase();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    if (!trimmedEmail) {
      toast.error("Please enter your email.");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match."
      );
      return;
    }

    setIsSubmitting(true);

    const existingUser =
      localStorage.getItem(
        "handcrafted-haven-user"
      );

    if (existingUser) {
      try {
        const user: RegisteredUser =
          JSON.parse(existingUser);

        if (user.email === trimmedEmail) {
          toast.error(
            "An account with this email already exists."
          );
          setIsSubmitting(false);
          return;
        }
      } catch {
        localStorage.removeItem(
          "handcrafted-haven-user"
        );
      }
    }

    const newUser: RegisteredUser = {
      name: trimmedName,
      email: trimmedEmail,
      password,
    };

    localStorage.setItem(
      "handcrafted-haven-user",
      JSON.stringify(newUser)
    );

    toast.success(
      "Account created successfully!"
    );

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setIsSubmitting(false);

    router.push("/login");
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="section-label">
            Handcrafted Haven
          </span>

          <h1>Become a Seller</h1>

          <p>
            Create your seller account and
            start sharing your handcrafted
            products with customers.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              autoComplete="name"
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-product-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating Account..."
              : "Create Seller Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}