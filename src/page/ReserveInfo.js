import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccessToken } from "../store/useStore";
import { getData } from "../api/Users";
import "../css/ReserveInfo.css";

const ReserveInfo = () => {
  const { id: storeId } = useParams();
  const token = useAccessToken().accessToken;
  const navigate = useNavigate();
  console.log(token);
  const [reservationTimes, setReservationTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleReserveInsert = () => {
    navigate(`/reserveinsert/${storeId}`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <div className="reserveInfoTitle">
        <h2>예약 가능 시간</h2>
        <button onClick={handleReserveInsert} className="reserveInsertButton">
          예약 시간 등록
        </button>
      </div>
      <ul>
        {reservationTimes.length > 0 ? (
          reservationTimes.map((time) => (
            <li key={time.availableReservationTimeId}>
              {time.availableReservationTime} {time.available ? "가능" : "불가"}
            </li>
          ))
        ) : (
          <li>예약 가능 시간이 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default ReserveInfo;
