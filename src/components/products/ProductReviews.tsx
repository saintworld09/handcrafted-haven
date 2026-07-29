"use client";

import { useState } from "react";
import { reviews as initialReviews } from "@/data/reviews";
import { Review } from "@/types/review";

export default function ProductReviews() {
  const [reviews, setReviews] =
    useState<Review[]>(initialReviews);

  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!author.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: Date.now(),
      author,
      rating,
      comment,
      date: new Date().toLocaleDateString(),
    };

    setReviews([newReview, ...reviews]);

    setAuthor("");
    setRating(5);
    setComment("");
  }

  return (
    <section className="product-reviews">

      <h2>Customer Reviews</h2>

      {reviews.map((review) => (
        <article
          key={review.id}
          className="review-card"
        >
          <h4>{review.author}</h4>

          <p className="review-stars">
            {"★".repeat(review.rating)}
          </p>

          <p>{review.comment}</p>

          <small>{review.date}</small>
        </article>
      ))}

      <div className="review-form-container">

        <h3>Leave a Review</h3>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Your Name"
            value={author}
            onChange={(e) =>
              setAuthor(e.target.value)
            }
          />

          <select
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
          >
            <option value={5}>★★★★★</option>
            <option value={4}>★★★★☆</option>
            <option value={3}>★★★☆☆</option>
            <option value={2}>★★☆☆☆</option>
            <option value={1}>★☆☆☆☆</option>
          </select>

          <textarea
            placeholder="Write your review..."
            rows={4}
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
          />

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