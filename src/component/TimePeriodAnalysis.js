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
import { getData } from "../api/Users";
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

const TimePeriodAnalysis = () => {
  const [waitingData, setWaitingData] = useState([]);
  const [visitData, setVisitData] = useState([]);
  const [visitPercentage, setVisitPercentage] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("오늘");

  const storeId = useStoreId();
  const tokenObject = useAccessToken();
  const token = tokenObject.accessToken;

  const fetchTodayData = async () => {
    try {
      const visitUrl = `/store/${storeId}/analysis/today-hourly-visit-counts`;
      const waitingUrl = `/store/${storeId}/analysis/today-hourly-waiting-counts`;
      const visitResponse = await getData(visitUrl, token);
      const waitingResponse = await getData(waitingUrl, token);
      console.log("오늘 방문자수:", visitResponse.data);
      console.log("오늘 웨이팅수:", waitingResponse.data);

      const sortedVisitData = visitResponse.data.sort((a, b) =>
        a.hour.localeCompare(b.hour)
      );
      const sortedWaitingData = waitingResponse.data.sort((a, b) =>
        a.hour.localeCompare(b.hour)
      );

      setVisitData(sortedVisitData);
      setWaitingData(sortedWaitingData);
    } catch (error) {
      console.error("오늘 시간대별 데이터 불러오기 오류:", error);
    }
  };

  const fetchMonthlyData = async (month) => {
    try {
      const visitUrl = `/store/${storeId}/analysis/monthly-hourly-visit-counts`;
      const waitingUrl = `/store/${storeId}/analysis/monthly-hourly-average-waiting-counts`;
      const visitResponse = await getData(visitUrl, token);
      const waitingResponse = await getData(waitingUrl, token);
      const sortedVisitData = (visitResponse.data[month] || []).sort((a, b) =>
        a.hour.localeCompare(b.hour)
      );
      const sortedWaitingData = (waitingResponse.data[month] || []).sort(
        (a, b) => a.hour.localeCompare(b.hour)
      );

      setVisitData(sortedVisitData);
      setWaitingData(sortedWaitingData);

      console.log("월 방문자수:", visitData);
      console.log("월 웨이팅수:", waitingData);
    } catch (error) {
      console.error("월별 시간대별 데이터 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    if (selectedPeriod === "오늘") {
      fetchTodayData();
    } else {
      fetchMonthlyData(selectedPeriod);
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
        <h5 style={{ margin: 0 }}>시간대 별 분석</h5>
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
              height: "25px",
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
              height: "25px",
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
            {maxVisitHour ? (
              <>
                <span>{maxVisitHour}시</span>에 가장 많은 사람이 방문했어요!!
              </>
            ) : (
              "방문자 데이터가 없어요😢"
            )}
          </p>
          <p className="timeText">
            {formatSelectedPeriod()}은{" "}
            {maxWaitingHour ? (
              <>
                <span>{maxWaitingHour}시</span>에 웨이팅을 가장 많이 했어요!!
              </>
            ) : (
              "웨이팅 데이터가 없어요😢"
            )}
          </p>
        </div>
      </div>
      <p className="timeAnalysisText">
        웨이팅한 인원 중{" "}
        <span>{visitPercentage.toFixed(2)}%가 매장을 방문</span>했고,{" "}
        <span>{(100 - visitPercentage).toFixed(2)}%는 방문하지 않았어요.</span>
        <br />
        오늘은 웨이팅 후 실제 방문 비율이
        {visitPercentage >= 50 ? (
          <>
            {" "}
            <span>높은</span> 편이네요! 😊
          </>
        ) : (
          <>
            {" "}
            <span>낮은</span> 편이네요 😥
          </>
        )}
        <br />
        웨이팅 고객의 방문율을 유지하거나 더 높일 방법을 고민해보는 것도
        좋겠어요. 📈
      </p>
    </div>
  );
};

export default TimePeriodAnalysis;
