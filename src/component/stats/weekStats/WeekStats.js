import React from "react";
import { Select, MenuItem } from "@mui/material";

import "../../../css/WeekStats.css";
import WeekVisitor from "./WeekVisitor";
import WeekWaiter from "./WeekWaiter";

export default function WeekStats() {
  // 오늘 날짜에서 현재 월과 연도 가져오기
  const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  const currentYear = today.getFullYear();
  const todayValue = `${currentYear}-${currentMonth}`;

  // 초기값을 오늘 달로 설정
  const [selectedMonth, setSelectedMonth] = React.useState(todayValue);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="weekly-stats">
      <div className="titleContainer">
        <h5 style={{ margin: 0 }}>요일 별 분석</h5>
        <div className="periodContainer">
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            variant="outlined"
            style={{
              backgroundColor: "#D9D9D9",
              color: "#000",
              padding: "10px",
              borderRadius: "5px",
              height: "25px",
            }}
          >
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
      <div className="weekly-chart-container">
        <WeekVisitor month={selectedMonth} />
        <WeekWaiter month={selectedMonth} />
      </div>
    </div>
  );
}
