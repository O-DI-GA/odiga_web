import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import "../css/ReviewList.css";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  const dummyReviews = [
    { reviewId: 1, rating: 5, content: "리뷰1" },
    { reviewId: 2, rating: 4, content: "리뷰2" },
    { reviewId: 3, rating: 3, content: "리뷰3" },
    { reviewId: 4, rating: 2, content: "리뷰4" },
    { reviewId: 5, rating: 1, content: "리뷰5" },
  ];

  useEffect(() => {
    setReviews(dummyReviews);
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {Array(fullStars)
          .fill()
          .map((_, i) => (
            <FaStar key={`full-${i}`} color="#FFC107" size={24} />
          ))}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <FaRegStar key={`empty-${i}`} color="#FFC107" size={24} />
          ))}
      </div>
    );
  };

  return (
    <div className="reviewList" style={{ height: "100%" }}>
      {reviews.map((review) => (
        <div key={review.reviewId} className="reviewItem">
          <div className="rating">{renderStars(review.rating)}</div>
          <p className="content">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
