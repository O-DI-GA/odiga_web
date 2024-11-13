import React, { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField, Button } from "@mui/material";

const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        height: "50px",
        alignItems: "center",
      }}
    >
      <Button
        onClick={() => setDatePickerVisible(!isDatePickerVisible)}
        style={{
          backgroundColor: "#D9D9D9",
          color: "#000",
          padding: "10px",
          borderRadius: "5px",
          border: "none",
          height: "30px",
        }}
      >
        기간 설정
      </Button>
      {isDatePickerVisible && (
        <div style={{ display: "flex", gap: "15px" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="시작일"
              value={startDate}
              onChange={(newDate) => onDateChange("start", newDate)}
              renderInput={(params) => (
                <TextField {...params} margin="normal" />
              )}
            />
            <DatePicker
              label="종료일"
              value={endDate}
              onChange={(newDate) => onDateChange("end", newDate)}
              minDate={startDate}
              renderInput={(params) => (
                <TextField {...params} margin="normal" />
              )}
            />
          </LocalizationProvider>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
