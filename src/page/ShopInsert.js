import React from "react";
import "../css/ShopInsert.css";

function ShopInsert() {
  return (
    <div className="shopInsert">
      <h1>가게 등록</h1>
      <form className="shopInsertForm">
        <div className="shopInsertFormItem">
          <label htmlFor="shopName">가게 이름</label>
          <input type="text" id="shopName" required></input>
        </div>
        <div className="shopInsertFormItem">
          <label>운영 시간</label>
          <input
            type="time"
            id="operationStartTime"
            className="timeInput"
            required
          ></input>
          ~
          <input
            type="time"
            id="operationEndTime"
            className="timeInput"
            required
          ></input>
        </div>
        <div className="shopInsertFormItem">
          <label>브레이크 타임</label>
          <input type="time" id="breakTimeStart" className="timeInput"></input>~
          <input type="time" id="breakTimeEnd" className="timeInput"></input>
        </div>
        <div className="shopInsertFormItem">
          <label htmlFor="photo">대표 사진</label>
          <input type="file" id="photo"></input>
        </div>
        <div className="shopInsertFormItem">
          <label htmlFor="address">주소</label>
          <input type="text" id="address" required></input>
        </div>
        <div className="shopInsertFormItem">
          <label htmlFor="tableNum">테이블 수</label>
          <input type="number" id="tableNum" required></input>
        </div>
        <div className="shopInsertFormItem">
          <label htmlFor="phone">전화번호</label>
          <input type="tel" id="phone" required></input>
        </div>
        <div className="shopInsertFormItem shopInsertButtonContainer">
          <button className="shopInsertButton shopInsertBack">취소</button>
          <button type="submit" className="shopInsertButton shopInsertSubmit">
            등록
          </button>
        </div>
      </form>
    </div>
  );
}

export default ShopInsert;
