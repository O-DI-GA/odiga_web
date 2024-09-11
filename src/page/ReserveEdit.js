import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccessToken } from "../store/useStore";
import { getData, updateData } from "../api/Users";
import "../css/ReserveInsert.css";

const ReserveEdit = () => {
  const { storeId, timeId } = useParams();
  const token = useAccessToken().accessToken;
  const navigate = useNavigate();

  const [reservationTime, setReservationTime] = useState({
    availableReservationTime: "",
    isAvailable: true,
  });
  const [loading, setLoading] = useState(true);

  // 예약 시간 불러오기
  useEffect(() => {
    const fetchReservationTime = async () => {
      try {
        const url = `/reservation/${storeId}/availableReservationTime`;
        const data = await getData(url, token);
        console.log("불러온 데이터: ", data);

        // timeId와 일치하는 예약 시간 찾기
        const selectedTime = data.data.find(
          (time) => time.availableReservationTimeId === parseInt(timeId)
        );

        if (selectedTime) {
          setReservationTime({
            availableReservationTime: selectedTime.availableReservationTime,
            isAvailable: selectedTime.isAvailable,
          });
        } else {
          console.error("해당 예약 시간을 찾을 수 없습니다.");
        }

        setLoading(false);
      } catch (error) {
        console.error("예약 시간을 불러오는 중 오류가 발생했습니다:", error);
        setLoading(false);
      }
    };

    fetchReservationTime();
  }, [storeId, timeId, token]);

  const handleInputChange = (field, value) => {
    setReservationTime({
      ...reservationTime,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = `/reservation/${storeId}/availableReservationTime/${timeId}`;
      await updateData(url, token, reservationTime);
      alert("예약 시간이 성공적으로 수정되었습니다.");
      setLoading(false);
      navigate(`/menuinsert/${storeId}`); // 예약 정보 페이지로 이동
    } catch (error) {
      console.error("예약 시간 수정 중 오류가 발생했습니다:", error);
      alert("예약 시간 수정 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="ReserveEdit">
      <h2 style={{ marginBottom: "30px" }}>예약 시간 수정</h2>
      <div>
        <input
          type="datetime-local"
          value={reservationTime.availableReservationTime}
          className="reservationTimeInput"
          onChange={(e) =>
            handleInputChange("availableReservationTime", e.target.value)
          }
        />
        <select
          value={reservationTime.isAvailable}
          className="isAvailableInput"
          onChange={(e) =>
            handleInputChange("isAvailable", e.target.value === "true")
          }
        >
          <option value="true">가능</option>
          <option value="false">불가</option>
        </select>
      </div>
      <button onClick={handleSubmit} className="reservationTimeSubmit">
        예약 시간 수정
      </button>
    </div>
  );
};

export default ReserveEdit;
