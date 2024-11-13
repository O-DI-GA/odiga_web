// 오늘 매출 현황

import React from "react";
import { getData } from "../../api/Users";
import { useAccessToken, useStoreId } from "../../store/useStore";

export default function TodayStats() {
  const token = useAccessToken().accessToken;
  const storeId = useStoreId();

  const [todayStats, setTodayStats] = React.useState({
    totalSalesAmount: 0,
    visitCount: 0,
    waitingCount: 0,
    bestMenu: "없음",
  });

  // 오늘 매출액 API
  const getTodayStats = async () => {
    try {
      const response = await getData(
        `/store/${storeId}/analysis/today-hourly-visit-counts`,
        token
      );
      // console.log("오늘 매출액 API  : ", response.data)

      if (response.data && response.data.totalSalesAmount != null) {
        return response.data.totalSalesAmount;
      } else {
        console.warn("오늘 매출액 데이터가 비었습니다.");
        return 0; // 기본값으로 0 반환
      }
    } catch (err) {
      console.error("오늘 매출액 API Error : ", err);
      return 0;
    }
  };

  // 오늘 방문자 수 API
  const getTodayVisitors = async () => {
    try {
      const response = await getData(
        `/store/${storeId}/analysis/today-hourly-visit-counts`,
        token
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        return response.data.reduce((sum, entry) => sum + entry.visitCount, 0);
      } else {
        console.warn("오늘 방문자 수 데이터가 비어있거나 빈 배열입니다.");
        return 0; // 빈 배열일 때 기본값 반환
      }
    } catch (err) {
      console.error("오늘 방문자 수 API Error: ", err);
      return 0; // 에러 발생 시 기본값 반환
    }
  };

  // 당일 웨이팅 수 API
  const getTodayWaiting = async () => {
    try {
      const response = await getData(
        `/store/${storeId}/analysis/today-hourly-waiting-counts`,
        token
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        return response.data.reduce(
          (sum, entry) => sum + entry.waitingCount,
          0
        );
      } else {
        console.warn("오늘 웨이팅 수 데이터가 비어있거나 올바르지 않습니다.");
        return 0; // 기본값으로 0 반환
      }
    } catch (err) {
      console.error("당일 웨이팅 수 API Error: ", err);
      return 0; // 에러 발생 시 기본값 반환
    }
  };

  // 당일 인기 메뉴 API
  const getBestMenu = async () => {
    try {
      const response = await getData(
        `/store/${storeId}/analysis/today-popular-menu`,
        token
      );

      if (response.data != null) {
        return response.data.menuName;
      } else {
        console.warn("당일 인기 메뉴 데이터가 비었습니다.");
        return "없음"; // 기본값 반환
      }
    } catch (err) {
      console.error("당일 인기 메뉴 API Error: ", err);
      return "없음";
    }
  };

  // todayStats 에 저장
  const fetchTodayStats = async () => {
    if (token) {
      const totalSalesAmount = await getTodayStats();
      const visitCount = await getTodayVisitors();
      const waitingCount = await getTodayWaiting();
      const bestMenu = await getBestMenu();

      setTodayStats({
        totalSalesAmount,
        visitCount,
        waitingCount,
        bestMenu,
      });
    }
    console.log("오늘 매출 현황 : ", todayStats);
  };

  React.useEffect(() => {
    try {
      fetchTodayStats().then((r) => {});
    } catch (err) {
      console.error("오늘 매출 현황 불러오기 실패 : ", err);
      // alert("오늘 매출 현황을 조회하는데 실패했습니다.")
    }
  }, []);

  return (
    <div>
      <h5> 오늘 매출 현황 </h5>
      <div>
        <p> ��� 매출�� : {todayStats.totalSalesAmount} won </p>
      </div>
      <div>
        <p> 방문자 수 : {todayStats.visitCount} </p>
      </div>
      <div>
        <p> ��이�� 수 : {todayStats.waitingCount} </p>
      </div>
      <div>
        <p> 인기 메��� : {todayStats.bestMenu} </p>
      </div>
    </div>
  );
}
