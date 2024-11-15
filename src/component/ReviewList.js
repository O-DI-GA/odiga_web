import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import "../css/ReviewList.css";
import axios from "axios";
import { useStoreId, useAccessToken } from "../store/useStore";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const storeId = useStoreId();
  const token = useAccessToken().accessToken;

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId || !token) return;

      try {
        const url = `http://13.125.83.255:8080/api/v1/store/${storeId}/reviews`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setReviews(response.data.data);
      } catch (error) {
        console.error("리뷰 목록 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchData();
  }, [storeId, token]);

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
