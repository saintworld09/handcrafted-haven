
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="register-page">
      <section className="register-container">
        <div className="register-header">
          <span className="register-eyebrow">Join Handcrafted Haven</span>

          <h1>Create Your Account</h1>

          <p>
            Choose how you want to use Handcrafted Haven and get started today.
          </p>
        </div>

        <div className="role-selection">
          <div className="role-card">
            <div className="role-icon">🛍️</div>

            <h2>Buyer</h2>

            <p>
              Discover unique handcrafted products and support talented
              artisans by purchasing their creations.
            </p>

            <Link href="/register/buyer" className="role-button">
              Sign Up as Buyer
            </Link>
          </div>

          <div className="role-card">
            <div className="role-icon">🎨</div>

            <h2>Seller</h2>

            <p>
              Showcase your creativity, create your seller profile, and share
              your handcrafted products with customers.
            </p>

            <Link href="/register/seller" className="role-button">
              Sign Up as Seller
            </Link>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link href="/login">Login here</Link>
          </p>
        </div>
      </section>
    </main>
  );
}