import React from "react";
import DateRangePicker from "./DateRangePicker";

import "../css/SalesAdvice.css";
import SalesStats from "./stats/SalesStats";

export default function SalesAdvice() {
  const today = new Date();
  const aMonthAgo = new Date();
  aMonthAgo.setMonth(today.getMonth() - 1);

  // 기간 설정
  const [startDate, setStartDate] = React.useState(aMonthAgo);
  const [endDate, setEndDate] = React.useState(today);

  const handleDateChange = (type, newDate) => {
    console.log(`Date change - Type: ${type}, New Date: ${newDate}`); // 디버깅 코드
    if (type === "start" && newDate) setStartDate(newDate);
    else if (type === "end" && newDate) setEndDate(newDate);
  };

  // 날짜를 보기 좋은 형식으로 변환
  const formatDate = (date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="titleView">
      <div className="titleContainer">
        <h5 style={{ marginBottom: 0 }}>매출 분석 종합 조언 📊</h5>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
      </div>
      <div>
        <p className="salesAdviceDate">
          {" "}
          🗓️ {formatDate(startDate)} ~ {formatDate(endDate)}{" "}
        </p>
        <SalesStats startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
}
