import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccessToken } from "../store/useStore";
import { getData, deleteData } from "../api/Users";
import { Button, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "../css/ReserveInfo.css";

const ReserveInfo = () => {
  const { id: storeId } = useParams();
  const token = useAccessToken().accessToken;
  const navigate = useNavigate();
  const [reservationTimes, setReservationTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredTimes, setFilteredTimes] = useState([]);

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
      console.log("선택한 날짜:", selectedDate.toDateString());
      console.log(
        "예약 가능한 시간:",
        filtered.map((time) => formatTime(time.availableReservationTime))
      );
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

  const handleReserveInsert = () => {
    navigate(`/reserveinsert/${storeId}`);
  };

  const handleEdit = (timeId) => {
    navigate(`/reserveedit/${storeId}`);
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
        <div>
          <button onClick={handleReserveInsert} className="reserveInsertButton">
            등록
          </button>
          <button onClick={handleEdit} className="reserveEditButton">
            수정
          </button>
        </div>
      </div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="날짜 선택"
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <div className="timeContainer">
        {filteredTimes.map((time) => (
          <Button key={time.availableReservationTimeId} variant="outlined">
            {formatTime(time.availableReservationTime)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ReserveInfo;
