import React, { useEffect, useState } from "react";
import { useAccessToken, useStoreId } from "../../../store/useStore";
import { getData } from "../../../api/Users";
import ReactApexChart from "react-apexcharts";

const CategoryMenuRete = ({ startDate, endDate, onBestMenuUpdate }) => {
  const storeId = useStoreId();
  const token = useAccessToken().accessToken;

  const [series, setSeries] = useState([]);

  const formattedStartDate = startDate.toISOString().slice(0, 16);
  const formattedEndDate = endDate.toISOString().slice(0, 16);

  const fetchCategoryMenuRate = async () => {
    try {
      const response = await getData(
          `/store/${storeId}/analysis/top-categories-analysis?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          token
      );
      if (response && response.data) {
        const data = response.data;
        const topMenu = findTopMenuByRatio(data);
        if (topMenu) onBestMenuUpdate(topMenu.category, topMenu.menu);
        return data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  function findTopMenuByRatio(data) {
    let topCategory = null;
    let topMenu = null;
    let highestRatio = 0;

    data.forEach((category) => {
      category.menus.forEach((menu) => {
        if (menu.ratio > highestRatio) {
          highestRatio = menu.ratio;
          topCategory = category.categoryName;
          topMenu = menu.menuName;
        }
      });
    });

    return { category: topCategory, menu: topMenu };
  }

  useEffect(() => {
    fetchCategoryMenuRate().then((data) => {
      if (data && data.length > 0) {
        // 데이터가 있는 경우에만 설정
        const formattedData = data.map((category) => ({
          name: category.categoryName,
          data: category.menus.map((menu) => ({
            x: menu.menuName,
            y: menu.totalSalesAmount,
          })),
        }));
        setSeries(formattedData);
      }
    });
  }, [startDate, endDate, storeId, token]);

  const options = {
    legend: {
      show: false
    },
    chart: {
      height: 350,
      type: "treemap"
    },
    title: {
      text: "카테고리 별 메뉴 비율",
      align: "center"
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.globals.labels[opts.seriesIndex];
      },
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    }
  };

  return (
    <div className="categoryRate-container">
      <div className="categoryRate-chart">
        {series.length > 0 ? (
          <ReactApexChart
            options={options}
            series={series}
            type="treemap"
            height={350}
          />
        ) : (
          <p>데이터가 없습니다.</p>
        )}{" "}
      </div>
    </div>
  );
};

export default CategoryMenuRete;
