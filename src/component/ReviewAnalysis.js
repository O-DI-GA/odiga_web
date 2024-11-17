import React, { useEffect, useState } from "react";
import ReviewStats from "./ReviewStats";
import ReviewList from "./ReviewList";
import "../css/ReviewAnalysis.css";
import { getRequest } from "../api/Users";
import { useStoreId, useAccessToken } from "../store/useStore";
import ReactMarkdown from "react-markdown";
import loading from "../assets/loading.gif";

const ReviewAnalysis = () => {
  const storeId = useStoreId();
  const token = useAccessToken().accessToken;
  const [reviewAnalysis, setReviewAnalysis] = useState({
    summary: "",
    solution: "",
    suggestions: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId || !token) return;

      setIsLoading(true);

      try {
        const url = `/store/${storeId}/analysis/review-analysis`;
        const response = await getRequest(url, token);
        console.log("리뷰 분석:", response.data);

        const content = response.data.content;

        const summary = content.match(
          /## 문제 요약\n([\s\S]*?)\n\n## 문제 해결 방법/
        )[1];
        const solution = content.match(
          /## 문제 해결 방법\n([\s\S]*?)\n\n## 추가 제안 사항/
        )[1];
        const suggestions = content.match(/## 추가 제안 사항\n([\s\S]*)/)[1];

        setReviewAnalysis({
          summary,
          solution,
          suggestions,
        });
      } catch (error) {
        console.error("리뷰 분석을 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [storeId, token]);

  return (
    <div className="reviewAnalysis">
      <div className="titleContainer">
        <h5 style={{ margin: 0 }}>리뷰</h5>
      </div>
      <div className="reviewContainer">
        <ReviewStats />
        <ReviewList />
      </div>
      <div className="reviewAnalysisContainer">
        {isLoading ? (
          <div className="loadingContainer">
            <img src={loading} alt="로딩 중..." />
            <h4>AI가 리뷰를 분석중이에요! 잠시만 기다려주세요 🙌</h4>
          </div>
        ) : reviewAnalysis.summary ||
          reviewAnalysis.solution ||
          reviewAnalysis.suggestions ? (
          <>
            <h6>🧐 이렇게 해보는 건 어때요?</h6>
            <div className="reviewAnalysisBox">
              <h5>🌟 AI가 리뷰를 요약했어요</h5>
              <ReactMarkdown>
                {reviewAnalysis.summary || "리뷰 요약 데이터가 없습니다."}
              </ReactMarkdown>
            </div>

            <div className="reviewAnalysisBox">
              <h5>🤖 문제 해결 방법</h5>
              <ReactMarkdown>
                {reviewAnalysis.solution || "문제 해결 방법 데이터가 없습니다."}
              </ReactMarkdown>
            </div>

            <div className="reviewAnalysisBox">
              <h5>💡 추가 제안 사항</h5>
              <ReactMarkdown>
                {reviewAnalysis.suggestions || "추가 제안 데이터가 없습니다."}
              </ReactMarkdown>
            </div>
          </>
        ) : (
          <div className="reviewAnalysisBox">
            <p style={{ margin: 0 }}>
              분석할 리뷰 데이터가 없어요. 😢 <br />
              새로운 리뷰가 등록되거나 데이터가 업데이트되면 다시 시도해주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAnalysis;
