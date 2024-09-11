import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccessToken } from "../store/useStore";
import { postData } from "../api/Users";
import "../css/ReserveInsert.css";

const ReserveInsert = () => {
  const { storeId } = useParams();
  const token = useAccessToken().accessToken;
  const navigate = useNavigate();

  const [reservationTimes, setReservationTimes] = useState([
    { availableReservationTime: "", isAvailable: true },
  ]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedTimes = [...reservationTimes];
    updatedTimes[index][field] = value;
    setReservationTimes(updatedTimes);
  };

  const handleAddTime = () => {
    setReservationTimes([
      ...reservationTimes,
      { availableReservationTime: "", isAvailable: true },
    ]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = `/reservation/${storeId}`;
      await postData(url, token, reservationTimes);
      alert("예약 시간이 성공적으로 등록되었습니다.");
      setLoading(false);
      navigate(`/menuinsert/${storeId}`); // 이전 화면으로 이동
    } catch (error) {
      console.error("예약 시간 등록 중 오류가 발생했습니다:", error);
      alert("예약 시간 등록 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="ReserveInsert">
      <h2 style={{ marginBottom: "30px" }}>예약 시간 등록</h2>
      {reservationTimes.map((time, index) => (
        <div key={index}>
          <input
            type="datetime-local"
            value={time.availableReservationTime}
            className="reservationTimeInput"
            onChange={(e) =>
              handleInputChange(
                index,
                "availableReservationTime",
                e.target.value
              )
            }
          />
          <select
            value={time.isAvailable}
            className="isAvailableInput"
            onChange={(e) =>
              handleInputChange(index, "isAvailable", e.target.value === "true")
            }
          >
            <option value="true">가능</option>
            <option value="false">불가</option>
          </select>
        </div>
      ))}
      <button onClick={handleAddTime} className="addTime">
        예약 시간 추가
      </button>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="reservationTimeSubmit"
      >
        {loading ? "등록 중..." : "예약 시간 등록"}
      </button>
    </div>
  );
};

export default ReserveInsert;
