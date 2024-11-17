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
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로캘 추가
import DateRangePicker from "./DateRangePicker";
import { FaMedal } from "react-icons/fa";
import "../css/MenuSalesAnalysis.css";
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

const MenuSalesAnalysis = () => {
  const storeId = useStoreId();
  const tokenObject = useAccessToken();
  const token = tokenObject.accessToken;

  // 오늘 날짜와 한 달 전 날짜를 한국 시간으로 설정
  const today = dayjs().locale("ko").endOf("day"); // 오늘 날짜, 한국 시간 기준 23:59:59
  const aMonthAgo = today.subtract(1, "month").startOf("day"); // 한 달 전 날짜, 23:59:59

  const [menuData, setMenuData] = useState([]);
  const [startDate, setStartDate] = useState(aMonthAgo.toDate());
  const [endDate, setEndDate] = useState(today.toDate());

  const fetchMenuSalesData = async () => {
    if (!token || !storeId) return;

    try {
      const formattedStartDate = dayjs(startDate).format("YYYY-MM-DDTHH:mm:ss");
      const formattedEndDate = dayjs(endDate).format("YYYY-MM-DDTHH:mm:ss");

      const url = `/store/${storeId}/analysis/menu-sales-statistics?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

      const data = await getRequest(url, token);
      console.log("데이터", data);
      setMenuData(data.data);
    } catch (error) {
      console.error(
        "메뉴 매출 데이터를 불러오는 중 오류가 발생했습니다:",
        error
      );
      if (error.response) {
        console.error("서버 응답:", error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchMenuSalesData();
  }, [startDate, endDate, token, storeId]);

  const chartData = {
    labels: menuData.map((item) => item.name),
    datasets: [
      {
        label: "메뉴별 판매량",
        data: menuData.map((item) => item.totalSalesCount),
        backgroundColor: "rgba(255, 150, 170, 0.8)",
      },
    ],
  };

  const handleDateChange = (type, newDate) => {
    if (type === "start") setStartDate(newDate);
    else if (type === "end") setEndDate(newDate);
  };

  const sortedBySalesAmount = [...menuData].sort(
    (a, b) => b.totalSalesAmount - a.totalSalesAmount
  );
  const top3Menus = sortedBySalesAmount.slice(0, 3);

  const sortedMenuData = [...menuData].sort(
    (a, b) => b.totalSalesCount - a.totalSalesCount
  );
  const [first, second, third] = sortedMenuData;

  return (
    <div className="menuSalesAnalysis">
      <div className="titleContainer">
        <h5 style={{ margin: 0 }}>메뉴 별 매출 분석</h5>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
      </div>
      <div className="menuAnalysisContainer">
        <div className="menuSalesGraph">
          <Bar data={chartData} />
        </div>
        <div className="menuRank">
          <h4>매출 Top 3</h4>
          {top3Menus.length > 0 ? (
            <ul>
              {top3Menus.map((item, index) => (
                <li key={item.name}>
                  <FaMedal className={`medal-${index + 1}`} />
                  <span className="menuName">{item.name}</span>
                  <span className="salesAmount">
                    {item.totalSalesAmount.toLocaleString()}원
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80%",
              }}
            >
              매출 데이터가 없습니다.
            </p>
          )}
        </div>
      </div>
      <p className="menuAnalysisText">
        {menuData.length > 0 ? (
          <>
            {dayjs(startDate).format("YYYY년 MM월 DD일")} 부터{" "}
            {dayjs(endDate).format("YYYY년 MM월 DD일")} 까지{" "}
            <span>{first?.name}</span>이(가){" "}
            <span>{first?.totalSalesCount}개</span>
            로 가장 인기 있었어요! 🎉
            <br />그 뒤로는 <span>{second?.name}</span>와(과){" "}
            <span>{third?.name}</span>
            이(가) 꾸준히 선택받았어요
            <br />
            다음 기간에는 또 어떤 메뉴가 인기 있을지 기대되네요! 👀
          </>
        ) : (
          <p style={{ margin: 0 }}>
            {dayjs(startDate).format("YYYY년 MM월 DD일")} 부터{" "}
            {dayjs(endDate).format("YYYY년 MM월 DD일")} 까지 매출 데이터가
            없어요 🥲
          </p>
        )}
      </p>
    </div>
  );
};

export default MenuSalesAnalysis;
