import MenuSalesAnalysis from "../component/MenuSalesAnalysis";
import TimePeriodAnalysis from "../component/TimePeriodAnalysis";
import YearlyReservationPattern from "../component/YearlyReservationPattern";
import ReviewAnalysis from "../component/ReviewAnalysis";

import TodayStats from "../component/stats/TodayStats";
import CategoryStats from "../component/stats/categoryStats/CategoryStats";
import WeekStats from "../component/stats/weekStats/WeekStats";
import SalesAdvice from "../component/SalesAdvice";
import { useStoreId } from "../store/useStore";

export default function Analysis() {
  const storeId = useStoreId();

  if (!storeId) {
    return (
      <div style={{ textAlign: "center", fontSize: "24px", marginTop: "80px" }}>
        먼저 가게를 등록해주세요!
      </div>
    );
  }

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
