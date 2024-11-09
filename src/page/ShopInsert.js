import React, { useState } from "react";
import "../css/ShopInsert.css";
import axios from "axios";
import { URL } from "../App.js";
import { useAccessToken } from "../store/useStore.js";
import { useNavigate } from "react-router-dom";
import { postWithFileData } from "../api/Users.js";

function ShopInsert() {
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [tableCount, setTableCount] = useState("");
  const [storeTitleImage, setStoreTitleImage] = useState(null);
  const [storeImage, setStoreImage] = useState([]);
  const [storeCategory, setStoreCategory] = useState("");

  const token = useAccessToken().accessToken;

  const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 주소 -> 위도 경도
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: googleApiKey,
          },
        }
      );

      const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
      console.log("latitude:", lat, "longitude:", lng);

      const formData = new FormData();
      formData.append("storeName", storeName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address", address);
      formData.append("tableCount", tableCount);
      formData.append("storeTitleImage", storeTitleImage);
      Array.from(storeImage).forEach((file) =>
        formData.append("storeImage", file)
      );
      formData.append("longitude", lng); // 경도
      formData.append("latitude", lat); // 위도
      formData.append("storeCategory", storeCategory);

      const postResponse = await postWithFileData(
        `${URL}/api/v1/owner/store`,
        token,
        formData
      );

      if (postResponse.httpStatusCode === 201) {
        alert("가게 등록 성공");
        navigate("/shoplist");
      }
    } catch (error) {
      alert("가게 등록 실패...");
    }
  };

  return (
    <div className="shopInsert">
      <form className="shopInsertForm" onSubmit={handleSubmit}>
        <h1 style={{ textAlign: "center" }}>가게 등록</h1>
        <div className="shopInsertFormItem">
          <label htmlFor="storeName">가게 이름</label>
          <input
            type="text"
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
        </div>
        <div className="shopInsertFormItem">
          <label htmlFor="phoneNumber">전화번호</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="shopInsertFormItem">
          <label htmlFor="address">주소</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="shopInsertFormItem">
          <label htmlFor="tableCount">테이블 수</label>
          <input
            type="number"
            id="tableCount"
            value={tableCount}
            onChange={(e) => setTableCount(e.target.value)}
            required
          />
        </div>
        <div className="shopInsertFormItem">
          <label htmlFor="storeTitleImage">대표 사진</label>
          <input
            type="file"
            id="storeTitleImage"
            onChange={(e) => setStoreTitleImage(e.target.files[0])}
            required
          />
        </div>
        <div className="shopInsertFormItem">
          <label htmlFor="storeImage">사진</label>
          <input
            type="file"
            id="storeImage"
            onChange={(e) => setStoreImage(e.target.files)}
            multiple
          />
        </div>
        <div className="shopInsertFormItem">
          <label htmlFor="storeCategory">카테고리</label>
          <input
            type="text"
            id="storeCategory"
            value={storeCategory}
            onChange={(e) => setStoreCategory(e.target.value)}
            required
          />
        </div>
        <div className="shopInsertFormItem shopInsertButtonContainer">
          <button
            type="button"
            className="shopInsertButton shopInsertBack"
            onClick={() => navigate("/")}
          >
            취소
          </button>
          <button type="submit" className="shopInsertButton shopInsertSubmit">
            등록
          </button>
        </div>
      </form>
    </div>
  );
}

export default ShopInsert;
