import React, { useState } from "react";
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

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const dummyData = {
    2024: [
      { month: "9", reservationCount: 6 },
      { month: "10", reservationCount: 9 },
    ],
    2023: [
      { month: "1", reservationCount: 2 },
      { month: "2", reservationCount: 5 },
      { month: "5", reservationCount: 3 },
      { month: "10", reservationCount: 2 },
    ],
    2022: [{ month: "1", reservationCount: 5 }],
  };

  const selectedYearData = dummyData[selectedYear.replace("년", "")] || [];

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
        <Line data={yearlyReservationData} options={{ responsive: true }} />
      </div>
      <p className="yearlyText">
        {selectedYear} 예약 패턴을 보면, {maxMonth}월에 예약 건수가 가장 많고{" "}
        {minMonth}월에 가장 적은 것으로 나타났어요.
      </p>
    </div>
  );
};

export default YearlyReservationPattern;
