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
import "../css/ReviewStats.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReviewStats = () => {
  const [reviewData, setReviewData] = useState({
    averageRating: 4.2,
    ratingCounts: { 1: 10, 2: 5, 3: 20, 4: 15, 5: 50 },
  });

  useEffect(() => {
    const dummyData = {
      averageRating: 4.2,
      ratingCounts: { 1: 10, 2: 5, 3: 20, 4: 15, 5: 50 },
    };
    setReviewData(dummyData);
  }, []);

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

  return (
    <div className="reviewStats">
      <div className="averageRating">
        <span>평균 평점: {reviewData.averageRating.toFixed(1)}</span>
      </div>
      <div className="ratingCounts">
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

export default ReviewStats;
