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

  const [menuData, setMenuData] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState(new Date("2024-11-10"));

  const fetchMenuSalesData = async () => {
    if (!token || !storeId) return;

    try {
      const formattedStartDate = `${startDate
        .toISOString()
        .split(".")[0]
        .slice(0, -3)}`;
      const formattedEndDate = `${endDate
        .toISOString()
        .split(".")[0]
        .slice(0, -3)}`;

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
        </div>
      </div>
      <p className="menuAnalysisText">
        {startDate.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        부터{" "}
        {endDate.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        까지 {first?.name}가 {first?.totalSalesCount}개로 가장 인기 있었어요! 🎉
        <br />그 뒤로는 {second?.name}과 {third?.name}이 꾸준히 선택받았어요
        <br />
        다음 기간에는 또 어떤 메뉴가 인기 있을지 기대되네요! 👀
      </p>
    </div>
  );
};

export default MenuSalesAnalysis;
