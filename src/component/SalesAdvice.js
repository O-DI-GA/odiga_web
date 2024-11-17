import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일
import DateRangePicker from "./DateRangePicker";

import "../css/SalesAdvice.css";
import SalesStats from "./stats/SalesStats";

export default function SalesAdvice() {
  // 오늘 날짜 및 한 달 전 날짜 설정
  const today = dayjs().locale("ko").endOf("day"); // 오늘 날짜 한국 시간 기준 23:59:59
  const aMonthAgo = today.subtract(1, "month").startOf("day"); // 한 달 전 날짜 00:00:00

  // 기간 설정
  const [startDate, setStartDate] = React.useState(aMonthAgo.toDate());
  const [endDate, setEndDate] = React.useState(today.toDate());

  const handleDateChange = (type, newDate) => {
    if (type === "start" && newDate) setStartDate(dayjs(newDate).toDate());
    else if (type === "end" && newDate) setEndDate(dayjs(newDate).toDate());
  };

  // 날짜를 보기 좋은 형식으로 변환
  const formatDate = (date) => {
    return dayjs(date).format("YYYY년 MM월 DD일");
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
