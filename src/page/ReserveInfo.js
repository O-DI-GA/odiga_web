import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccessToken, useStoreId } from "../store/useStore";
import { getData, deleteData } from "../api/Users";
import { Button, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "../css/ReserveInfo.css";

import ReserveInsert from "./ReserveInsert";
import ReserveEdit from "./ReserveEdit";

const ReserveInfo = () => {
  const storeId = useStoreId();

  const token = useAccessToken().accessToken;
  const navigate = useNavigate();
  const [reservationTimes, setReservationTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date()); // 기본값: 오늘 날짜
  const [filteredTimes, setFilteredTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const [showInsert, setShowInsert] = useState(false); // ReserveInsert 표시 여부
  const [showEdit, setShowEdit] = useState(false);

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

  useEffect(() => {
    if (selectedDate) {
      const filtered = reservationTimes.filter((time) => {
        const timeDate = new Date(time.availableReservationTime).toDateString();
        return timeDate === selectedDate.toDateString();
      });
      setFilteredTimes(filtered);
    } else {
      setFilteredTimes([]);
    }
  }, [selectedDate, reservationTimes]);

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleDelete = async () => {
    if (!selectedTime) return;

    try {
      const url = `/reservation/availableReservationTime/${selectedTime}`;
      await deleteData(url, token);
      setReservationTimes(
        reservationTimes.filter(
          (time) => time.availableReservationTimeId !== selectedTime
        )
      );
      alert("예약 시간이 삭제되었습니다.");
      setSelectedTime(null);
    } catch (error) {
      console.error("예약 시간 삭제 중 오류가 발생했습니다:", error);
      alert("예약 시간 삭제 중 오류가 발생했습니다.");
    }
  };

  const toggleInsert = () => {
    setShowInsert((prev) => !prev);
    setShowEdit(false); // 다른 화면은 닫기
  };

  const toggleEdit = () => {
    setShowEdit((prev) => !prev);
    setShowInsert(false); // 다른 화면은 닫기
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <div className="reserveInfoTitle">
        <p>예약 가능 시간</p>
      </div>
      <div className="reserveInfoTitleBox">
        <div className="reserveInfoSection">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="날짜 선택"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          {selectedTime && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              className="deleteButton"
            >
              선택한 시간 삭제
            </Button>
          )}
        </div>

        <div className="timeContainer">
          {filteredTimes
            .slice()
            .sort(
              (a, b) =>
                new Date(a.availableReservationTime).getTime() -
                new Date(b.availableReservationTime).getTime()
            )
            .map((time) => (
              <Button
                key={time.availableReservationTimeId}
                variant="outlined"
                onClick={() => setSelectedTime(time.availableReservationTimeId)}
                className={
                  selectedTime === time.availableReservationTimeId
                    ? "selectedTimeButton"
                    : ""
                }
              >
                {formatTime(time.availableReservationTime)}
              </Button>
            ))}
        </div>
        <div className="reserveInsertContainer">
          <button
            onClick={toggleEdit}
            className="reserveEditButton"
            style={{
              backgroundColor: showEdit ? "#4077c9" : "#d5e5f3",
              color: showEdit ? "#fff" : "initial",
            }}
          >
            수정하기
          </button>
          <button
            onClick={toggleInsert}
            className="reserveInsertButton"
            style={{
              backgroundColor: showInsert ? "#4077c9" : "#d5e5f3",
              color: showInsert ? "#fff" : "initial",
            }}
          >
            새로운 시간 등록하기
          </button>
        </div>
      </div>

      {/* ReserveInsert 컴포넌트 */}
      {showInsert && (
        <div className="reserveInsertSection">
          <ReserveInsert />
        </div>
      )}

      {/* ReserveEdit 컴포넌트 */}
      {showEdit && (
        <div className="reserveEditSection">
          <ReserveEdit initialDate={selectedDate} />
        </div>
      )}
    </div>
  );
};

export default ReserveInfo;
