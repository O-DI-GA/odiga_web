import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccessToken } from "../store/useStore";
import { getData, deleteData } from "../api/Users";
import "../css/ReserveInfo.css";

const ReserveInfo = () => {
  const { id: storeId } = useParams();
  const token = useAccessToken().accessToken;
  const navigate = useNavigate();
  console.log(token);
  const [reservationTimes, setReservationTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservationTimes = async () => {
      try {
        const url = `/reservation/${storeId}/availableReservationTime`;
        const data = await getData(url, token);
        setReservationTimes(data.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "예약 가능 시간을 불러오는 중 오류가 발생했습니다:",
          error
        );
        setLoading(false);
      }
    };

    fetchReservationTimes();
  }, [storeId, token]);

  const handleReserveInsert = () => {
    navigate(`/reserveinsert/${storeId}`);
  };

  const handleEdit = (timeId) => {
    navigate(`/reserveedit/${storeId}/${timeId}`);
  };

  const handleDelete = async (timeId) => {
    try {
      const url = `/reservation/availableReservationTime/${timeId}`;
      await deleteData(url, token);
      setReservationTimes(
        reservationTimes.filter(
          (time) => time.availableReservationTimeId !== timeId
        )
      );
      alert("예약 시간이 삭제되었습니다.");
    } catch (error) {
      console.error("예약 시간 삭제 중 오류가 발생했습니다:", error);
      alert("예약 시간 삭제 중 오류가 발생했습니다.");
    }
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
      <ul className="reserveTimeList">
        {reservationTimes.length > 0 ? (
          reservationTimes
            .slice()
            .sort(
              (a, b) =>
                new Date(a.availableReservationTime) -
                new Date(b.availableReservationTime)
            )
            .map((time) => (
              <li
                key={time.availableReservationTimeId}
                className="reserveTimeContainer"
              >
                {time.availableReservationTime}
                <div className="reserveTimeButtonContainer">
                  <button
                    className="reserveTimeButton"
                    onClick={() => handleEdit(time.availableReservationTimeId)}
                  >
                    수정
                  </button>
                  <button
                    className="reserveTimeButton"
                    onClick={() =>
                      handleDelete(time.availableReservationTimeId)
                    }
                  >
                    삭제
                  </button>
                </div>
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
