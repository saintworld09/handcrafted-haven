import Link from "next/link";

export default function Navbar() {
  return (
    <header>
      <nav className="navbar">
        <div className="navbar-container">
        <Link href="/" className="logo">
            Handcrafted Haven
            </Link>

          <ul className="nav-links">
            <li>
              <Link href="/">Home</Link>
            </li>

            <li>
              <Link href="/products">Products</Link>
            </li>

            <li>
              <Link href="/sellers">Sellers</Link>
            </li>

            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>

          <div className="auth-links">
            <Link href="/login">Login</Link>

            <Link href="/register" className="register-btn">
              Register
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}