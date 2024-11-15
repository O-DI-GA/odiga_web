import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import "../css/ReviewStats.css";
import { getRequest } from "../api/Users";
import { useStoreId, useAccessToken } from "../store/useStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReviewStats = () => {
  const storeId = useStoreId();
  const token = useAccessToken().accessToken;
  const [reviewData, setReviewData] = useState({
    averageRating: 0,
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId || !token) return;

      try {
        const url = `/store/${storeId}/analysis/review-statistics`;
        const response = await getRequest(url, token);
        console.log("리뷰 통계:", response.data);
        setReviewData(response.data);
      } catch (error) {
        console.error("리뷰 통계를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchData();
  }, [storeId, token]);

  const maxCount = Math.max(...Object.values(reviewData.ratingCounts)) * 1.15;

  const data = {
    labels: ["5", "4", "3", "2", "1"],
    datasets: [
      {
        label: "별점 분포",
        data: [
          reviewData.ratingCounts["5"] || 0,
          reviewData.ratingCounts["4"] || 0,
          reviewData.ratingCounts["3"] || 0,
          reviewData.ratingCounts["2"] || 0,
          reviewData.ratingCounts["1"] || 0,
        ],
        backgroundColor: "rgba(94, 101, 231, 0.8)",
        borderRadius: 10,
        barThickness: 10,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}명`,
        },
      },
      datalabels: {
        anchor: "end",
        align: "end",
        formatter: (value) => `${value}명`,
        color: "black",
      },
    },
    scales: {
      x: {
        max: maxCount,
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: false,
        },
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  const renderStars = (averageRating) => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {Array(fullStars)
          .fill()
          .map((_, i) => (
            <FaStar key={`full-${i}`} color="#FFC107" size={24} />
          ))}
        {halfStar && <FaStarHalfAlt color="#FFC107" size={24} />}{" "}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <FaRegStar key={`empty-${i}`} color="#FFC107" size={24} />
          ))}
      </div>
    );
  };

  return (
    <div className="reviewStats">
      <div className="averageRating">
        {renderStars(reviewData.averageRating)}
        <span className="averageRatingText">
          {reviewData.averageRating.toFixed(1)}
        </span>
        <span className="ratingNum">
          ({Object.values(reviewData.ratingCounts).reduce((a, b) => a + b, 0)})
        </span>
      </div>
      <div className="ratingCounts">
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

export default ReviewStats;
