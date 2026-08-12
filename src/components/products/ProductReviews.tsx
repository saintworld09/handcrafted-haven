
"use client";

import { useState } from "react";
import { reviews as initialReviews } from "@/data/reviews";
import { Review } from "@/types/review";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const [reviews, setReviews] =
    useState<Review[]>(initialReviews);

  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!author.trim() || !comment.trim()) {
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      author: author.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString(),
    };

    setReviews((currentReviews) => [
      newReview,
      ...currentReviews,
    ]);

    setAuthor("");
    setRating(5);
    setComment("");
  }

  return (
    <section className="product-reviews">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>

        <p>
          {reviews.length}{" "}
          {reviews.length === 1
            ? "review"
            : "reviews"}
        </p>
      </div>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">
            No reviews yet. Be the first to review
            this product!
          </p>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="review-card"
            >
              <div className="review-card-header">
                <div>
                  <h4>{review.author}</h4>

                  <p className="review-stars">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(
                      Math.max(
                        0,
                        5 - review.rating
                      )
                    )}
                  </p>
                </div>

                <small>{review.date}</small>
              </div>

              <p className="review-comment">
                {review.comment}
              </p>
            </article>
          ))
        )}
      </div>

      <div className="review-form-container">
        <h3>Leave a Review</h3>

        <p>
          Share your experience with this
          handcrafted product.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="review-form-group">
            <label
              htmlFor={`review-author-${productId}`}
            >
              Your Name
            </label>

            <input
              id={`review-author-${productId}`}
              type="text"
              placeholder="Enter your name"
              value={author}
              onChange={(e) =>
                setAuthor(e.target.value)
              }
              required
            />
          </div>

          <div className="review-form-group">
            <label
              htmlFor={`review-rating-${productId}`}
            >
              Rating
            </label>

            <select
              id={`review-rating-${productId}`}
              value={rating}
              onChange={(e) =>
                setRating(
                  Number(e.target.value)
                )
              }
            >
              <option value={5}>
                ★★★★★ — Excellent
              </option>

              <option value={4}>
                ★★★★☆ — Very Good
              </option>

              <option value={3}>
                ★★★☆☆ — Good
              </option>

              <option value={2}>
                ★★☆☆☆ — Fair
              </option>

              <option value={1}>
                ★☆☆☆☆ — Poor
              </option>
            </select>
          </div>

          <div className="review-form-group">
            <label
              htmlFor={`review-comment-${productId}`}
            >
              Your Review
            </label>

            <textarea
              id={`review-comment-${productId}`}
              placeholder="Write your review..."
              rows={5}
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="submit-review-btn"
          >
            Submit Review
          </button>
        </form>
      </div>
    </section>
  );
}