import React from "react";
import dayjs from "dayjs";
import { useAccessToken, useStoreId } from "../../../store/useStore";
import { getData } from "../../../api/Users";
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

// Chart.js 필수 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeekWaiter = ({ month }) => {
  const storeId = useStoreId();
  const token = useAccessToken().accessToken;

  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [mostDay, setMostDay] = React.useState([]);
  const [waitingData, setWaitingData] = React.useState([]);

  // 요일 영어-한국어 매핑
  const dayMap = {
    Monday: "월요일",
    Tuesday: "화요일",
    Wednesday: "수요일",
    Thursday: "목요일",
    Friday: "금요일",
    Saturday: "토요일",
    Sunday: "일요일",
  };

  const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // 날짜 범위 계산 함수 (dayjs 사용)
  const calculateDateRange = (month) => {
    if (month) {
      const [year, mon] = month.split("-");
      const start = dayjs(`${year}-${mon}-01T00:00:00`).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      const lastDay = dayjs(`${year}-${mon}-01`)
        .endOf("month")
        .format("YYYY-MM-DD");
      const end = dayjs(`${lastDay}T23:59:59`).format("YYYY-MM-DDTHH:mm:ss");
      return { start, end };
    }
    return { start: "", end: "" };
  };

  // API 호출 함수
  const fetchWatierData = async () => {
    if (token && startDate && endDate) {
      try {
        console.log("startDate : ", startDate, " endDate : ", endDate);
        const response = await getData(
          `/store/${storeId}/analysis/monthly-day-waiting-counts?startDate=${startDate}&endDate=${endDate}`,
          token
        );

        const responseData = response.data;

        // 모든 요일을 포함한 데이터 생성
        const completeData = allDays.map((day) => {
          const dayData = responseData.days.find((d) => d.dayOfWeek === day);
          return {
            dayOfWeek: day,
            waitingCount: dayData ? dayData.waitingCount : 0, // 없는 요일은 0으로 설정
          };
        });

        setMostDay(responseData.mostDay.map((day) => dayMap[day] || day));
        setWaitingData(completeData);
      } catch (error) {
        console.error("요일 별 웨이팅 수 API 호출 실패", error);
      }
    }
  };

  // month 변경 시 날짜 계산 후 상태 업데이트
  React.useEffect(() => {
    const { start, end } = calculateDateRange(month);
    setStartDate(start);
    setEndDate(end);
  }, [month]);

  // startDate와 endDate 변경 시 API 호출
  React.useEffect(() => {
    fetchWatierData();
  }, [startDate, endDate]);

  // Chart.js 데이터 설정
  const chartData = {
    labels: allDays, // x축: 모든 요일
    datasets: [
      {
        label: "웨이팅 수",
        data: waitingData.map((data) => data.waitingCount), // y축: 웨이팅 수
        borderColor: "rgba(54, 162, 235, 1)", // 선 색상
        backgroundColor: "rgba(54, 162, 235, 1)", // 배경 색상
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
        {mostDay && mostDay.length > 0 ? (
          <p>
            {dayjs(month).format("M")}월은 <span>{mostDay.join(", ")}</span>에
            웨이팅을 가장 많이 했어요!
          </p>
        ) : (
          <p>{dayjs(month).format("M")}월은 웨이팅 데이터가 없어요😢</p>
        )}
      </div>
    </div>
  );
};

export default WeekWaiter;
