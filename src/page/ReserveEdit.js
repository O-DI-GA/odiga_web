import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccessToken } from "../store/useStore";
import { getData, updateData } from "../api/Users";
import { Button, TextField } from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "../css/ReserveEdit.css";

const ReserveEdit = () => {
  const { storeId } = useParams();
  const token = useAccessToken().accessToken;
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [intervalMinutes, setIntervalMinutes] = useState(30);

  useEffect(() => {
    if (selectedDate) {
      const fetchReservationTimes = async () => {
        try {
          const url = `/reservation/${storeId}`;
          const data = await getData(url, token);
          const selectedDayData = data.data.filter(
            (time) =>
              new Date(time.availableReservationTime).toDateString() ===
              selectedDate.toDateString()
          );

          if (selectedDayData.length > 0) {
            const availableTime = new Date(
              selectedDayData[0].availableReservationTime
            );
            setStartTime(availableTime);
            setEndTime(new Date(availableTime.getTime() + 60 * 60 * 1000)); // 기본 1시간 추가
          }
        } catch (error) {
          console.error("예약 시간을 불러오는 중 오류가 발생했습니다:", error);
        }
      };

      fetchReservationTimes();
    }
  }, [selectedDate, storeId, token]);

  const handleSaveChanges = async () => {
    try {
      const url = `/reservation/${storeId}`;
      await updateData(url, token, {
        storeId: parseInt(storeId),
        date: selectedDate.toISOString().split("T")[0], // "YYYY-MM-DD" 형식으로 변환
        newStartTime: startTime
          ? startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        newEndTime: endTime
          ? endTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        intervalMinutes,
        isAvailable: true,
      });
      alert("예약 시간이 성공적으로 수정되었습니다.");
      navigate(`/reserveinfo/${storeId}`);
    } catch (error) {
      console.error("예약 시간 수정 중 오류가 발생했습니다:", error);
      alert("예약 시간 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="reserveEdit">
        <h2 className="title">예약 시간 수정</h2>

        <div className="dateSelection">
          <DatePicker
            label="날짜 선택"
            value={selectedDate}
            onChange={(newDate) => {
              setSelectedDate(newDate);
            }}
            renderInput={(params) => (
              <TextField {...params} className="inputField" />
            )}
          />
        </div>

        <div className="timeSelection">
          <TimePicker
            label="시작 시간"
            value={startTime}
            onChange={(newStartTime) => setStartTime(newStartTime)}
            renderInput={(params) => (
              <TextField {...params} className="inputField" />
            )}
          />
          <TimePicker
            label="종료 시간"
            value={endTime}
            onChange={(newEndTime) => setEndTime(newEndTime)}
            renderInput={(params) => (
              <TextField {...params} className="inputField" />
            )}
          />
        </div>

        <div className="intervalSelection">
          <select
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(parseInt(e.target.value))}
            className="inputField"
          >
            <option value={30}>30분</option>
            <option value={60}>1시간</option>
          </select>
          <label>간격</label>
        </div>

        <button onClick={handleSaveChanges} className="saveButton">
          변경 사항 저장
        </button>
      </div>
    </LocalizationProvider>
  );
};

export default ReserveEdit;
