import React, { useEffect, useState } from "react";
import ReviewStats from "./ReviewStats";
import ReviewList from "./ReviewList";
import "../css/ReviewAnalysis.css";
import { getRequest } from "../api/Users";
import { useStoreId, useAccessToken } from "../store/useStore";
import ReactMarkdown from "react-markdown";

const ReviewAnalysis = () => {
  const storeId = useStoreId();
  const token = useAccessToken().accessToken;
  const [reviewAnalysis, setReviewAnalysis] = useState({
    summary: "",
    solution: "",
    suggestions: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId || !token) return;

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
        <h6>🧐 이렇게 해보는 건 어때요?</h6>
        <div className="reviewAnalysisBox">
          <h5>🌟 AI가 리뷰를 요약했어요</h5>
          <ReactMarkdown>{reviewAnalysis.summary}</ReactMarkdown>
        </div>

        <div className="reviewAnalysisBox">
          <h5>🤖 문제 해결 방법</h5>
          <ReactMarkdown>{reviewAnalysis.solution}</ReactMarkdown>
        </div>

        <div className="reviewAnalysisBox">
          <h5>💡 추가 제안 사항</h5>
          <ReactMarkdown>{reviewAnalysis.suggestions}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ReviewAnalysis;
