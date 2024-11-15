import React, { useEffect, useState } from "react";
import { getData } from "../../../api/Users";
import { useAccessToken, useStoreId } from "../../../store/useStore";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeekVisitor = ({ month }) => {
  const storeId = useStoreId();
  const token = useAccessToken().accessToken;

  const [visitData, setVisitData] = useState([]);
  const [mostDays, setMostDays] = useState([]); // 가장 많은 방문자 수가 있는 요일

  const dayMap = {
    MONDAY: "월요일",
    TUESDAY: "화요일",
    WEDNESDAY: "수요일",
    THURSDAY: "목요일",
    FRIDAY: "금요일",
    SATURDAY: "토요일",
    SUNDAY: "일요일",
  };

  const allDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const fetchVisitorData = async () => {
    if (token) {
      try {
        const response = await getData(
          `/store/${storeId}/analysis/monthly-day-visit-counts`,
          token
        );

        const monthlyData = response.data?.[month] || []; // month에 해당하는 데이터 가져오기
        const completeData = allDays.map((day) => {
          const dayData = monthlyData.find((d) => d.day === day);
          return {
            day: dayMap[day], // 한국어 요일명
            visitCount: dayData ? dayData.visitCount : 0, // 데이터가 없으면 0으로 설정
          };
        });

        setVisitData(completeData);

        // 방문자 수가 가장 많은 요일 찾기 (동률 처리)
        const maxVisitCount = Math.max(
          ...completeData.map((d) => d.visitCount)
        );
        const mostDays = completeData
          .filter((d) => d.visitCount === maxVisitCount && maxVisitCount > 0)
          .map((d) => d.day);

        setMostDays(mostDays); // 가장 방문자가 많은 요일 리스트 설정
      } catch (error) {
        console.error("요일 별 방문자수 API 호출 실패", error);
      }
    }
  };

  useEffect(() => {
    fetchVisitorData();
  }, [month, token]);

  const chartData = {
    labels: visitData.map((data) => data.day), // x축: 한국어 요일
    datasets: [
      {
        label: "방문자 수",
        data: visitData.map((data) => data.visitCount), // y축: 방문자 수
        borderColor: "rgba(75, 192, 192, 1)", // 선 색상
        backgroundColor: "rgba(75, 192, 192, 0.2)", // 배경 색상
        tension: 0,
      },
    ],
  };

  return (
    <div className="weekly-chart-box">
      <div className="weekly-chart">
        <Line data={chartData} options={{ responsive: true }} />
      </div>
      <div className="weekly-text-box">
        {visitData.some((data) => data.visitCount > 0) ? (
          <p>
            {month.split("-")[1]}월은{" "}
            <span>
              {mostDays.length > 0 ? mostDays.join(", ") : "데이터 없음"}
            </span>
            에 가장 많은 사람이 방문했어요!
          </p>
        ) : (
          <p>{month.split("-")[1]}월은 방문자 데이터가 없어요😢</p>
        )}
      </div>
    </div>
  );
};

export default WeekVisitor;
