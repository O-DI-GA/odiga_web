// CategoryStats.js
import React from "react";
import DateRangePicker from "../../DateRangePicker";
import CategoryRate from "./CategoryRate";
import CategoryMenuRete from "./CategoryMenuRate";
import "../../../css/CategoryStats.css";

export default function CategoryStats() {
  const today = new Date();
  const aMonthAgo = new Date();
  aMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = React.useState(aMonthAgo);
  const [endDate, setEndDate] = React.useState(today);

  const [bestCategory, setBestCategory] = React.useState("");
  const [bestMenu, setBestMenu] = React.useState({
    category: "",
    menu: "",
  });

  const handleDateChange = (type, newDate) => {
    console.log(`Date change - Type: ${type}, New Date: ${newDate}`); // 디버깅 코드
    if (type === "start" && newDate) setStartDate(newDate);
    else if (type === "end" && newDate) setEndDate(newDate);
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
            까지 카테고리 중 <span>{bestCategory}</span>에서 매출이 가장{" "}
            <span>높아요</span>!!
            <br />
            <span>{bestMenu.category}</span> 카테고리에서는{" "}
            <span>{bestMenu.menu}</span>
             이(가) 가장 인기가 많았네요 👀
          </p>
        ) : (
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
            까지 카테고리 별 매출 데이터가 없어요🥲
          </p>
        )}
      </div>
    </div>
  );
}
