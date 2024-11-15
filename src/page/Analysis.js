import MenuSalesAnalysis from "../component/MenuSalesAnalysis";
import TimePeriodAnalysis from "../component/TimePeriodAnalysis";
import YearlyReservationPattern from "../component/YearlyReservationPattern";
import ReviewAnalysis from "../component/ReviewAnalysis";

import TodayStats from "../component/stats/TodayStats";
import CategoryStats from "../component/stats/categoryStats/CategoryStats";
import WeekStats from "../component/stats/weekStats/WeekStats";
import SalesAdvice from "../component/SalesAdvice";

export default function Analysis() {
  return (
    <div
      style={{
        backgroundColor: "#f4f4f4",
        margin: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      <TodayStats />
      <CategoryStats />
      <MenuSalesAnalysis />
      <TimePeriodAnalysis />
      <WeekStats />
      <YearlyReservationPattern />
      <SalesAdvice />
      <ReviewAnalysis />
    </div>
  );
}
