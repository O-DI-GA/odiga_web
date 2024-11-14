import React from "react";
import ReviewStats from "./ReviewStats";
import ReviewList from "./ReviewList";
import "../css/ReviewAnalysis.css";

const ReviewAnalysis = () => {
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
          <p>
            고객이 음식의 맛은 좋지만, 직원의 불친절함, 가게의 시끄러운 환경,
            음식 준비 지연, 그리고 가격 대비 음식 양의 부족을 문제로 지적하고
            있습니다.
          </p>
        </div>
        <div className="reviewAnalysisBox">
          <h5>🤖 문제 해결 방법</h5>
          <p>
            1. 직원 교육 강화
            <br />
            고객 응대의 질을 높이기 위해 정기적인 친절 교육 및 서비스 매뉴얼을
            마련합니다. 특히, 첫인상은 매장의 이미지를 결정짓는 중요한
            요소이므로, 인사나 기본 응대 방식을 개선하고 고객과의 소통에 대한
            가이드라인을 마련합니다.
          </p>
          <p>
            2. 매장 환경 개선
            <br />
            가게의 소음 수준을 관리하기 위해 소음 흡수 패널이나 방음 장치를
            설치하고, 조명과 음악 볼륨을 조절하여 고객들이 편안하게 대화할 수
            있는 환경을 조성합니다. 또한, 테이블 간 간격을 조정하여 프라이버시를
            보호할 수 있는 환경을 만들어 고객의 불만을 줄입니다.
          </p>
          <p>
            3. 조리 프로세스 개선
            <br />
            음식 준비 과정을 점검하여 지연 원인을 파악하고, 조리 프로세스를
            효율화하여 대기 시간을 줄입니다. 재료 준비나 조리 과정을 더욱
            체계화하고, 필요시 추가 인력을 배치하여 피크 시간대에도 빠르게
            음식을 제공할 수 있도록 합니다.
          </p>
        </div>
        <div className="reviewAnalysisBox">
          <h5>💡 추가 제안 사항</h5>
          <p>
            가격 대비 가치 재조정
            <br />
            메뉴의 양과 가격을 재검토하여 고객이 느끼는 가성비를 개선합니다.
            특히, 추가 옵션으로 음식을 더 주문할 수 있는 선택지를 제공하거나
            가격 대비 만족도를 높일 수 있는 메뉴 구성을 고려합니다.
          </p>
          <p>
            고객 피드백 반영 시스템 구축
            <br />
            고객의 피드백을 정기적으로 수집하고 분석하여 서비스와 환경 개선에
            반영할 수 있는 시스템을 구축합니다. 고객의 목소리를 직접 반영할 수
            있는 제안함이나 온라인 피드백 시스템을 도입하여 고객의 전반적인
            만족도를 높이는 데 기여할 수 있습니다.
          </p>
          <p>
            프로모션 및 마케팅 전략 재조정
            <br />
            가게의 이미지를 개선하기 위해 친절한 서비스와 쾌적한 환경을 강조하는
            마케팅 전략을 수립합니다. 특히, 고객이 긍정적인 경험을 공유하고
            싶어하는 요소를 부각시켜 입소문 마케팅을 활성화할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewAnalysis;
