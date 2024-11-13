import React, { useState, useEffect } from "react";
import { Select, MenuItem } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../css/YearlyReservationPattern.css";
import { getRequest } from "../api/Users";
import { useStoreId, useAccessToken } from "../store/useStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const YearlyReservationPattern = () => {
  const [selectedYear, setSelectedYear] = useState("2024년");
  const [reservationData, setReservationData] = useState([]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const storeId = useStoreId();
  const token = useAccessToken().accessToken;

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId || !token) return;

      try {
        const url = `/store/${storeId}/analysis/reservation-counts`;
        const response = await getRequest(url, token);
        console.log("연간 예약 데이터:", response.data);
        setReservationData(response.data);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchData();
  }, [storeId, token]);

  const selectedYearData = (
    reservationData[selectedYear.replace("년", "")] || []
  ).sort((a, b) => parseInt(a.month) - parseInt(b.month));

  const noDataMessage = `${selectedYear}에는 예약이 없어요🙁`;

  const maxReservation = Math.max(
    ...selectedYearData.map((item) => item.reservationCount)
  );
  const minReservation = Math.min(
    ...selectedYearData.map((item) => item.reservationCount)
  );

  const maxMonth =
    selectedYearData.find((item) => item.reservationCount === maxReservation)
      ?.month || "";
  const minMonth =
    selectedYearData.find((item) => item.reservationCount === minReservation)
      ?.month || "";

  const yearlyReservationData = {
    labels: selectedYearData.map((item) => `${item.month}월`),
    datasets: [
      {
        label: `${selectedYear} 예약 수`,
        data: selectedYearData.map((item) => item.reservationCount),
        borderColor: "rgb(0, 150, 0, 1)",
        backgroundColor: "rgba(0, 150, 0, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "시간",
        },
      },
      y: {
        title: {
          display: true,
          text: "인원 수",
        },
      },
    },
  };

  return (
    <div className="yearlyReservationPattern">
      <div className="titleContainer">
        <h5 style={{ margin: 0 }}>연간 예약 패턴</h5>
        <div className="periodContainer">
          <Select
            variant="outlined"
            value={selectedYear}
            onChange={handleYearChange}
            style={{
              backgroundColor: "#D9D9D9",
              color: "#000",
              padding: "10px",
              borderRadius: "5px",
              height: "25px",
            }}
          >
            <MenuItem value="2022년">2022년</MenuItem>
            <MenuItem value="2023년">2023년</MenuItem>
            <MenuItem value="2024년">2024년</MenuItem>
          </Select>
        </div>
      </div>
      <div className="yearlyGraph">
        <Line data={yearlyReservationData} options={chartOptions} />
      </div>
      {selectedYearData.length > 0 ? (
        <p className="yearlyText">
          {selectedYear} 예약 패턴을 보면, {maxMonth}월에 예약 건수가 가장 많고{" "}
          {minMonth}월에 가장 적은 것으로 나타났어요.
        </p>
      ) : (
        <p className="yearlyText">{noDataMessage}</p>
      )}
    </div>
  );
};

export default YearlyReservationPattern;
