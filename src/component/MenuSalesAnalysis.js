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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField, Button } from "@mui/material";
import "../css/MenuSalesAnalysis.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MenuSalesAnalysis = () => {
  const [menuData, setMenuData] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState(new Date("2024-01-31"));
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    const dummyData = [
      { name: "메인1", totalSalesCount: 6, totalSalesAmount: 5994 },
      { name: "메인2", totalSalesCount: 8, totalSalesAmount: 7992 },
      { name: "메인3", totalSalesCount: 7, totalSalesAmount: 6993 },
      { name: "사이드1", totalSalesCount: 9, totalSalesAmount: 8991 },
      { name: "사이드2", totalSalesCount: 11, totalSalesAmount: 10989 },
      { name: "사이드3", totalSalesCount: 9, totalSalesAmount: 8991 },
    ];

    setMenuData(dummyData);
  }, []);

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
        <h2>메뉴 별 매출 분석</h2>
        <Button
          variant="contained"
          onClick={() => setDatePickerVisible(!isDatePickerVisible)}
          className="datePickerButton"
          style={{ backgroundColor: "#D9D9D9", color: "#000" }}
        >
          기간 설정
        </Button>
        {isDatePickerVisible && (
          <div className="datePickerContainer">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="시작일"
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
                renderInput={(params) => (
                  <TextField {...params} margin="normal" />
                )}
              />
              <DatePicker
                label="종료일"
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
                minDate={startDate}
                renderInput={(params) => (
                  <TextField {...params} margin="normal" />
                )}
              />
            </LocalizationProvider>
          </div>
        )}
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
                <span className="rankIndex">{index + 1}</span>
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