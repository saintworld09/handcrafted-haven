"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { useProducts } from "@/context/ProductsContext";
import { useAuth } from "@/context/AuthContext";

export default function AddProductForm() {
  const router = useRouter();

  const { addProduct } = useProducts();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  /*
   * -------------------------------------------------
   * Handle text/select changes
   * -------------------------------------------------
   */

  function handleChange(
    e: ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /*
   * -------------------------------------------------
   * Handle image selection
   * -------------------------------------------------
   */

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Limit image size to 5 MB.
     */
    const maxFileSize =
      5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setError(
        "Image size must be less than 5 MB."
      );

      e.target.value = "";
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((current) => ({
        ...current,
        image:
          typeof reader.result === "string"
            ? reader.result
            : "",
      }));
    };

    reader.onerror = () => {
      setError(
        "Unable to read the selected image."
      );
    };

    reader.readAsDataURL(file);
  }

  /*
   * -------------------------------------------------
   * Submit Product
   * -------------------------------------------------
   */

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    /*
     * The UI checks the current authenticated user,
     * but the API performs the real authorization.
     */

    if (!user) {
      setError(
        "You must be logged in as a seller."
      );
      return;
    }

    if (user.role !== "seller") {
      setError(
        "Only seller accounts can add products."
      );
      return;
    }

    /*
     * Validate required fields.
     */

    const productName =
      formData.name.trim();

    const description =
      formData.description.trim();

    const category =
      formData.category.trim();

    const numericPrice = Number(
      formData.price
    );

    if (!productName) {
      setError(
        "Please enter a product name."
      );
      return;
    }

    if (!category) {
      setError(
        "Please select a category."
      );
      return;
    }

    if (!formData.price) {
      setError(
        "Please enter a product price."
      );
      return;
    }

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      setError(
        "Please enter a valid product price."
      );
      return;
    }

    if (!formData.image) {
      setError(
        "Please select a product image."
      );
      return;
    }

    if (!description) {
      setError(
        "Please enter a product description."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * IMPORTANT:
       *
       * Do not send seller or sellerId here.
       *
       * The API gets the authenticated seller
       * from the HTTP-only session cookie.
       */

      await addProduct({
        name: productName,
        category,
        price: numericPrice,
        image: formData.image,
        description,
        seller: "",
        sellerId: "",
      });

      /*
       * Product was successfully created.
       */

      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error(
        "Failed to add product:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to add product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /*
   * -------------------------------------------------
   * No authenticated user
   * -------------------------------------------------
   */

  if (!user) {
    return (
      <section className="auth-required">
        <h2>Seller Login Required</h2>

        <p>
          You must sign in as a seller
          before you can add a product.
        </p>

        <button
          type="button"
          className="primary-btn"
          onClick={() =>
            router.push("/login")
          }
        >
          Login
        </button>
      </section>
    );
  }

  /*
   * -------------------------------------------------
   * Buyer attempting to add a product
   * -------------------------------------------------
   */

  if (user.role !== "seller") {
    return (
      <section className="auth-required">
        <h2>Seller Account Required</h2>

        <p>
          Only seller accounts can add
          handcrafted products.
        </p>

        <button
          type="button"
          className="primary-btn"
          onClick={() =>
            router.push(
              "/dashboard/buyer"
            )
          }
        >
          Go to Buyer Dashboard
        </button>
      </section>
    );
  }

  /*
   * -------------------------------------------------
   * Seller Product Form
   * -------------------------------------------------
   */

  return (
    <form
      onSubmit={handleSubmit}
      className="product-form"
    >
      <div className="form-group">
        <label htmlFor="seller">
          Seller
        </label>

        <input
          id="seller"
          type="text"
          value={user.name}
          readOnly
          disabled
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">
          Product Name
        </label>

        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter product name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">
          Category
        </label>

        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        >
          <option value="">
            Select Category
          </option>

          <option value="Pottery">
            Pottery
          </option>

          <option value="Home Décor">
            Home Décor
          </option>

          <option value="Woodwork">
            Woodwork
          </option>

          <option value="Candles">
            Candles
          </option>

          <option value="Jewelry">
            Jewelry
          </option>

          <option value="Artwork">
            Artwork
          </option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="price">
          Price ($)
        </label>

        <input
          id="price"
          type="number"
          name="price"
          placeholder="Enter price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">
          Product Image
        </label>

        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          disabled={isSubmitting}
        />

        {formData.image && (
          <div className="image-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.image}
              alt="Product Preview"
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Describe your handcrafted product..."
          value={formData.description}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <p
          className="auth-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className="submit-product-btn"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Adding Product..."
          : "Add Product"}
      </button>
    </form>
  );
}