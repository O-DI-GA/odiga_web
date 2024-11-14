import React from "react";
import { getData } from "../../../api/Users";
import { useAccessToken, useStoreId } from "../../../store/useStore";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../../../css/CategoryStats.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryRate = ({ startDate, endDate, onBestCategoryUpdate }) => {
  const storeId = useStoreId();
  const token = useAccessToken().accessToken;
  const [categoryData, setCategoryData] = React.useState([]);

  // ISO 형식으로 변환된 날짜
  const formattedStartDate = startDate.toISOString().slice(0, 16);
  const formattedEndDate = endDate.toISOString().slice(0, 16);

  // 카테고리 별 매출 분석 API
  const fetchCategoryData = async () => {
    try {
      const response = await getData(
        `/store/${storeId}/analysis/category-sales-statistics?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        token
      );
      if (response && response.data) {
        console.log("카테고리 별 매출 분석 : ", response);
        setCategoryData(response.data);

        // 매출이 가장 높은 카테고리 설정
        if (response.data.length > 0) {
          const highestCategory = response.data.reduce((max, item) =>
            item.totalSalesAmount > max.totalSalesAmount ? item : max
          );
          onBestCategoryUpdate(highestCategory.name);
        }
      }
    } catch (err) {
      console.error("카테고리별 매출 분석 API 호출 실패", err);
    }
  };

  React.useEffect(() => {
    fetchCategoryData();
  }, [storeId, token, startDate, endDate]);

  // 데이터가 없을 경우 기본값 설정
  const defaultData = [{ name: "카테고리 별 매출", totalSalesAmount: 1 }];

  // 데이터가 없을 경우 defaultData 사용
  const displayData = categoryData.length > 0 ? categoryData : defaultData;

  // 고정된 색상 배열 설정
  const fixedColors = [
    "#4CAF50", // Green
    "#36A2EB", // Blue
    "#FF6384", // Red
    "#FFCE56", // Yellow
    "#FFA726", // Orange
  ];

  // 차트 데이터 구성
  const chartData = {
    labels: displayData.map((item) => item.name),
    datasets: [
      {
        data: displayData.map((item) => item.totalSalesAmount),
        backgroundColor: fixedColors.slice(0, displayData.length),
        hoverBackgroundColor: fixedColors.slice(0, displayData.length),
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // 범례 비활성화
      },
      tooltip: {
        enabled: true, // 툴팁 활성화
      },
      title: {
        display: true,
        text: "카테고리 별 매출 비율",
        font: {
          size: 16,
        },
        padding: {
          top: 0,
          bottom: 20,
        },
      },
    },
  };

  return (
    <div className="categoryRate-container">
      <div className="categoryRate-chart">
        <Pie data={chartData} options={options} />
      </div>
      <div className="chart-label">
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {displayData.map((item, index) => (
            <li
              key={item.name}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                className="category-color-box"
                style={{
                  backgroundColor: fixedColors[index],
                }}
              ></div>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryRate;
