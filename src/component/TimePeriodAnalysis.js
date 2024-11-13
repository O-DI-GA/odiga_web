import React, { useEffect, useState } from "react";
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
import "../css/TimePeriodAnalysis.css";
import { Button, Select, MenuItem } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimePeriodAnalysis = () => {
  const [waitingData, setWaitingData] = useState([]);
  const [visitData, setVisitData] = useState([]);
  const [visitPercentage, setVisitPercentage] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("오늘");

  const todayVisitData = [
    { hour: "10:00", visitCount: 2 },
    { hour: "11:00", visitCount: 3 },
    { hour: "12:00", visitCount: 5 },
    { hour: "13:00", visitCount: 7 },
    { hour: "14:00", visitCount: 4 },
    { hour: "15:00", visitCount: 3 },
    { hour: "16:00", visitCount: 6 },
    { hour: "17:00", visitCount: 2 },
  ];

  const todayWaitingData = [
    { hour: "10:00", waitingCount: 5 },
    { hour: "11:00", waitingCount: 8 },
    { hour: "12:00", waitingCount: 10 },
    { hour: "13:00", waitingCount: 9 },
    { hour: "14:00", waitingCount: 1 },
    { hour: "15:00", waitingCount: 3 },
    { hour: "16:00", waitingCount: 6 },
    { hour: "17:00", waitingCount: 5 },
  ];

  const monthlyVisitData = {
    "2024-10": [
      { hour: "10:00", visitCount: 1 },
      { hour: "11:00", visitCount: 2 },
      { hour: "12:00", visitCount: 3 },
      { hour: "13:00", visitCount: 1 },
      { hour: "14:00", visitCount: 2 },
    ],
    "2024-11": [
      { hour: "10:00", visitCount: 4 },
      { hour: "11:00", visitCount: 3 },
      { hour: "12:00", visitCount: 6 },
      { hour: "13:00", visitCount: 2 },
      { hour: "14:00", visitCount: 3 },
    ],
  };

  const monthlyWaitingData = {
    "2024-10": [
      { hour: "10:00", waitingCount: 2.0 },
      { hour: "11:00", waitingCount: 4.0 },
      { hour: "12:00", waitingCount: 7.0 },
      { hour: "13:00", waitingCount: 1.0 },
      { hour: "14:00", waitingCount: 3.0 },
    ],
    "2024-11": [
      { hour: "10:00", waitingCount: 4 },
      { hour: "11:00", waitingCount: 8.0 },
      { hour: "12:00", waitingCount: 6.0 },
      { hour: "13:00", waitingCount: 1.0 },
      { hour: "14:00", waitingCount: 3.0 },
    ],
  };

  useEffect(() => {
    if (selectedPeriod === "오늘") {
      setVisitData(todayVisitData);
      setWaitingData(todayWaitingData);
    } else {
      setVisitData(monthlyVisitData[selectedPeriod] || []);
      setWaitingData(monthlyWaitingData[selectedPeriod] || []);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    const totalWaiting = waitingData.reduce(
      (sum, item) => sum + item.waitingCount,
      0
    );
    const totalVisit = visitData.reduce(
      (sum, item) => sum + item.visitCount,
      0
    );
    const percentage =
      totalWaiting > 0 ? Math.min((totalVisit / totalWaiting) * 100, 100) : 0;
    setVisitPercentage(percentage);
  }, [visitData, waitingData]);

  const visitChartData = {
    labels: visitData.map((d) => d.hour),
    datasets: [
      {
        label: "방문자 수",
        data: visitData.map((d) => d.visitCount),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
    ],
  };

  const waitingChartData = {
    labels: waitingData.map((d) => d.hour),
    datasets: [
      {
        label: "웨이팅 수",
        data: waitingData.map((d) => d.waitingCount),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
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

  const getMaxVisitHour = () => {
    if (visitData.length === 0) return null;
    const maxVisit = Math.max(...visitData.map((d) => d.visitCount));
    const maxVisitHour = visitData.find((d) => d.visitCount === maxVisit).hour;
    return maxVisitHour.split(":")[0];
  };

  const getMaxWaitingHour = () => {
    if (waitingData.length === 0) return null;
    const maxWaiting = Math.max(...waitingData.map((d) => d.waitingCount));
    const maxWaitingHour = waitingData.find(
      (d) => d.waitingCount === maxWaiting
    ).hour;
    return maxWaitingHour.split(":")[0];
  };

  const formatSelectedPeriod = () => {
    if (selectedPeriod === "오늘") return selectedPeriod;
    const month = selectedPeriod.split("-")[1];
    return `${parseInt(month, 10)}월`;
  };

  const maxVisitHour = getMaxVisitHour();
  const maxWaitingHour = getMaxWaitingHour();

  return (
    <div className="timePeriodAnalysis">
      <div className="titleContainer">
        <h2>시간대 별 분석</h2>
        <div className="periodContainer">
          <Button
            onClick={() => setSelectedPeriod("오늘")}
            style={{
              backgroundColor: "#D9D9D9",
              color: "#000",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              marginRight: "10px",
              height: "30px",
            }}
          >
            오늘
          </Button>
          <Select
            value={selectedPeriod}
            onChange={(event) => setSelectedPeriod(event.target.value)}
            variant="outlined"
            style={{
              backgroundColor: "#D9D9D9",
              color: "#000",
              padding: "10px",
              borderRadius: "5px",
              height: "30px",
            }}
          >
            <MenuItem value="오늘">월 선택</MenuItem>
            {Array.from({ length: 12 }, (_, i) => {
              const month = String(i + 1).padStart(2, "0");
              return (
                <MenuItem value={`2024-${month}`} key={month}>
                  {i + 1}월
                </MenuItem>
              );
            })}
          </Select>
        </div>
      </div>
      <div className="timeAnalysisContainer">
        <div className="timeGraphContainer">
          <div className="timeVisitGraph">
            <Line data={visitChartData} options={chartOptions} />
          </div>
          <div className="timeWaitingGraph">
            <Line data={waitingChartData} options={chartOptions} />
          </div>
        </div>
        <div className="timeTextContainer">
          <p className="timeText">
            {formatSelectedPeriod()}은{" "}
            {maxVisitHour
              ? `${maxVisitHour}시에 가장 많은 사람이 방문했어요!!`
              : "방문자 데이터가 없어요😢"}
          </p>
          <p className="timeText">
            {formatSelectedPeriod()}은{" "}
            {maxWaitingHour
              ? `${maxWaitingHour}시에 웨이팅을 가장 많이 했어요!!`
              : "웨이팅 데이터가 없어요😢"}
          </p>
        </div>
      </div>
      <p className="timeAnalysisText">
        웨이팅한 인원 중 {visitPercentage.toFixed(2)}%가 매장을 방문했고,{" "}
        {(100 - visitPercentage).toFixed(2)}%는 방문하지 않았어요.
        <br />
        {visitPercentage >= 50
          ? "오늘은 웨이팅 후 실제 방문 비율이 꽤 높은 편이네요! 😊"
          : "오늘은 웨이팅 후 실제 방문 비율이 낮은 편이네요😥"}
        <br />
        웨이팅 고객의 방문율을 유지하거나 더 높일 방법을 고민해보는 것도
        좋겠어요. 📈
      </p>
    </div>
  );
};

export default TimePeriodAnalysis;
