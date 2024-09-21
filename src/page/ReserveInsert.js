import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccessToken } from "../store/useStore";
import { postData } from "../api/Users";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "../css/ReserveInsert.css";

const ReserveInsert = () => {
  const { storeId } = useParams();
  const token = useAccessToken().accessToken;
  const navigate = useNavigate();

  const [selectedDays, setSelectedDays] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [month, setMonth] = useState(9);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [intervalMinutes, setIntervalMinutes] = useState(30);
  const [loading, setLoading] = useState(false);

  const handleDaySelect = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddSchedule = () => {
    const newSchedules = selectedDays.map((day) => ({
      dayOfWeek: day,
      startTime: startTime
        ? startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      endTime: endTime
        ? endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "",
      intervalMinutes,
    }));

    // 기존 month가 있으면 업데이트, 없으면 추가
    const updatedScheduleData = [...scheduleData];
    const existingMonthIndex = updatedScheduleData.findIndex(
      (schedule) => schedule.month === month
    );

    if (existingMonthIndex !== -1) {
      // 해당 월이 이미 존재하면 daySchedules만 업데이트
      updatedScheduleData[existingMonthIndex].daySchedules = [
        ...updatedScheduleData[existingMonthIndex].daySchedules,
        ...newSchedules,
      ];
    } else {
      // 해당 월이 없으면 새로운 월 스케줄 추가
      updatedScheduleData.push({
        month: month,
        daySchedules: newSchedules,
      });
    }

    setScheduleData(updatedScheduleData);
    setSelectedDays([]);
  };

  const handleRemoveSchedule = (monthIndex, dayIndex) => {
    const updatedSchedule = [...scheduleData];
    updatedSchedule[monthIndex].daySchedules.splice(dayIndex, 1);
    if (updatedSchedule[monthIndex].daySchedules.length === 0) {
      updatedSchedule.splice(monthIndex, 1); // 해당 월에 스케줄이 없으면 월도 삭제
    }
    setScheduleData(updatedSchedule);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = `/reservation/${storeId}`;
      await postData(url, token, {
        storeId: parseInt(storeId),
        schedules: scheduleData,
      });
      alert("예약 시간이 성공적으로 등록되었습니다.");
      setLoading(false);
      navigate(`/menuinsert/${storeId}`);
    } catch (error) {
      console.error("예약 시간 등록 중 오류가 발생했습니다:", error);
      alert("예약 시간 등록 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="reserveInsert">
        <h2 className="title">예약 시간 등록</h2>

        <div className="monthSelection">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}월
              </option>
            ))}
          </select>
        </div>

        <div className="daySelection">
          {["월", "화", "수", "목", "금", "토", "일"].map((day, index) => (
            <button
              key={index}
              className={`dayButton ${
                selectedDays.includes(day) ? "selected" : ""
              }`}
              onClick={() => handleDaySelect(day)}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="scheduleSettings">
          <div className="inputGroup">
            <TimePicker
              label="시작 시간"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => (
                <input {...params} className="timeInput" />
              )}
            />
            <TimePicker
              label="종료 시간"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => (
                <input {...params} className="timeInput" />
              )}
            />
          </div>

          <div className="inputGroup">
            <label>간격⠀⠀⠀</label>
            <div className="radioGroup">
              <label>
                <input
                  type="radio"
                  value={30}
                  checked={intervalMinutes === 30}
                  onChange={() => setIntervalMinutes(30)}
                />
                30분
              </label>
              <label>
                <input
                  type="radio"
                  value={60}
                  checked={intervalMinutes === 60}
                  onChange={() => setIntervalMinutes(60)}
                />
                1시간
              </label>
            </div>
          </div>

          <button onClick={handleAddSchedule} className="addScheduleButton">
            + 시간 추가
          </button>
        </div>

        <div className="scheduleList">
          {scheduleData.map((schedule, monthIndex) => (
            <div key={monthIndex} className="scheduleItem">
              <h3>{schedule.month}월</h3>
              {schedule.daySchedules.map((daySchedule, dayIndex) => (
                <div key={dayIndex} className="scheduleSubitem">
                  <span>{daySchedule.dayOfWeek}요일</span>
                  <span>
                    {daySchedule.startTime} ~ {daySchedule.endTime}
                  </span>
                  <span>{daySchedule.intervalMinutes}분 간격</span>
                  <button
                    onClick={() => handleRemoveSchedule(monthIndex, dayIndex)}
                    className="removeScheduleButton"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="reservationSubmitButton"
        >
          {loading ? "등록 중..." : "예약 시간 등록"}
        </button>
      </div>
    </LocalizationProvider>
  );
};

export default ReserveInsert;
