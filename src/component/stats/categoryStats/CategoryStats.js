import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 추가
import DateRangePicker from "../../DateRangePicker";
import CategoryRate from "./CategoryRate";
import CategoryMenuRete from "./CategoryMenuRate";
import "../../../css/CategoryStats.css";

export default function CategoryStats() {
  // 오늘 날짜와 한 달 전 날짜 설정
  const today = dayjs().locale("ko").endOf("day"); // 오늘 날짜 (한국 시간 기준 23:59:59)
  const aMonthAgo = today.subtract(1, "month").startOf("day"); // 한 달 전 날짜 (한국 시간 기준 00:00:00)

  const [startDate, setStartDate] = React.useState(aMonthAgo.toDate());
  const [endDate, setEndDate] = React.useState(today.toDate());

  const [bestCategory, setBestCategory] = React.useState("");
  const [bestMenu, setBestMenu] = React.useState({
    category: "",
    menu: "",
  });

  const handleDateChange = (type, newDate) => {
    if (type === "start" && newDate) setStartDate(dayjs(newDate).toDate());
    else if (type === "end" && newDate) setEndDate(dayjs(newDate).toDate());
  };

  // bestCategory 설정
  const handleBestCategoryUpdate = (categoryName) => {
    setBestCategory(categoryName);
  };

  // bestMenu 설정
  const handleBestMenuUpdate = (categoryName, menuName) => {
    setBestMenu({
      category: categoryName,
      menu: menuName,
    });
  };

  // 날짜를 보기 좋은 형식으로 변환
  const formatDate = (date) => {
    return dayjs(date).format("YYYY년 MM월 DD일");
  };

  return (
    <div className="categoryStatsContainer">
      <div className="titleContainer">
        <h5 style={{ marginBottom: 0 }}>카테고리 별 매출 분석</h5>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
      </div>
      <div className="chart-box">
        {startDate && endDate && (
          <CategoryRate
            startDate={startDate}
            endDate={endDate}
            onBestCategoryUpdate={handleBestCategoryUpdate}
          />
        )}
        {startDate && endDate && (
          <CategoryMenuRete
            startDate={startDate}
            endDate={endDate}
            onBestMenuUpdate={handleBestMenuUpdate}
          />
        )}
      </div>
      <div className="comment-text-box">
        {bestMenu && bestCategory ? (
          <p className="menuAnalysisText">
            {formatDate(startDate)} 부터 {formatDate(endDate)} 까지 카테고리 중{" "}
            <span>{bestCategory}</span>에서 매출이 가장 <span>높아요</span>!!
            <br />
            <span>{bestMenu.category}</span> 카테고리에서는{" "}
            <span>{bestMenu.menu}</span>
            이(가) 가장 인기가 많았네요 👀
          </p>
        ) : (
          <p className="menuAnalysisText">
            {formatDate(startDate)} 부터 {formatDate(endDate)} 까지 카테고리 별
            매출 데이터가 없어요🥲
          </p>
        )}
      </div>
    </div>
  );
}
