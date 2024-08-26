import React, { useEffect, useState } from "react";
import "../css/ShopList.css";
import axios from "axios";
import { URL } from "../App.js";
import { useAccessToken } from "../store/useStore.js";

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = useAccessToken().accessToken;

  useEffect(() => {
    axios
      .get(`${URL}/api/v1/owner/store`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.httpStatusCode === 200) {
          setShops(response.data.data);
        } else {
          setError("Failed to fetch shops.");
        }
      })
      .catch((error) => {
        setError("Error fetching data: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ position: "relative" }}>
      <h1 className="shopListTitle">내 가게 목록</h1>
      <a href="/shopinsert" className="addShop">
        + 가게 추가
      </a>
      {shops.length === 0 ? (
        <p>등록된 가게가 없습니다.</p>
      ) : (
        <div className="shopList">
          {shops.map((shop) => (
            <div key={shop.storeId} className="shopItem">
              <div className="shopInfo">
                <h2 className="ellipsis" style={{ marginBottom: "10px" }}>
                  {shop.storeName}
                </h2>
                <p className="ellipsis">{shop.address}</p>
                <p>{shop.phoneNumber}</p>
                <p>리뷰 {shop.reviewCount}개</p>
                <p>{shop.storeCategory || "카테고리 없음"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopList;
