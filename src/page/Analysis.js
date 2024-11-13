import MenuSalesAnalysis from "../component/MenuSalesAnalysis";
import TimePeriodAnalysis from "../component/TimePeriodAnalysis";

export default function Analysis() {
  return (
    <div style={{ backgroundColor: "#f4f4f4", margin: "20px" }}>
      <MenuSalesAnalysis />
      <TimePeriodAnalysis />
    </div>
  );
}
