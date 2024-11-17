import React from "react";
import { useAccessToken, useStoreId } from "../../store/useStore";
import { getData } from "../../api/Users";
import ReactMarkdown from "react-markdown";
import loading from "../../assets/loading.gif";

import "../../css/SalesAdvice.css";

const SalesStats = ({ startDate, endDate }) => {
  const storeId = useStoreId();
  const token = useAccessToken().accessToken;
  const [salesAnalysis, setSalesAnalysis] = React.useState({
    evaluation: "",
    advice: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // ISO 형식으로 기간 변환
  const formatter = (startDate, endDate) => {
    const formattedStartDate = startDate.toISOString().slice(0, 16);
    const formattedEndDate = endDate.toISOString().slice(0, 16);

    return { start: formattedStartDate, end: formattedEndDate };
  };

  // 매출 분석 조언 API
  const fetchSalesAdvice = async () => {
    if (!token || !storeId) return;

    setIsLoading(true);

    const { start, end } = formatter(startDate, endDate);
    try {
      const response = await getData(
        `/store/${storeId}/analysis/sales-advice?startDate=${start}&endDate=${end}`,
        token
      );

      const content = response.data.content;

      // 정규식을 사용하여 내용 추출
      const evaluationMatch = content.match(
        /## 전체 매출 평가\n([\s\S]*?)\n\n## 매출에 대한 조언/
      );
      const adviceMatch = content.match(/## 매출에 대한 조언\n([\s\S]*)/);

      // 매칭된 내용에서 그룹을 가져와 설정
      const evaluation = evaluationMatch ? evaluationMatch[1].trim() : "";
      const advice = adviceMatch ? adviceMatch[1].trim() : "";

      setSalesAnalysis({ evaluation, advice });
    } catch (error) {
      console.error("매출 분석 조언 API 호출 중 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSalesAdvice();
  }, [startDate, endDate]);

  return (
    <div className="reviewAnalysisContainer">
      {isLoading ? (
        <div className="loadingContainer">
          <img src={loading} alt="로딩 중..." />
          <h4>AI가 매출를 분석중이에요! 잠시만 기다려주세요 🙌</h4>
        </div>
      ) : (
        <>
          {salesAnalysis.evaluation || salesAnalysis.advice ? (
            <>
              <div className="reviewAnalysisBox">
                <p className="analysisName">전체 매출 평가</p>
                {salesAnalysis.evaluation ? (
                  <ReactMarkdown>{salesAnalysis.evaluation}</ReactMarkdown>
                ) : (
                  <p className="noDataText">매출 데이터가 없습니다.</p>
                )}
              </div>

              <div className="reviewAnalysisBox">
                <p className="analysisName">매출에 대한 조언</p>
                {salesAnalysis.advice ? (
                  <ReactMarkdown>{salesAnalysis.advice}</ReactMarkdown>
                ) : (
                  <p className="noDataText">매출 데이터가 없습니다.</p>
                )}
              </div>
            </>
          ) : (
            <div className="reviewAnalysisBox">
              <p style={{ margin: 0 }}>
                선택된 기간 동안의 매출 데이터가 없어요.
                <br />
                기간을 다시 설정하거나 데이터가 있는지 확인해 주세요! 😊
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SalesStats;
