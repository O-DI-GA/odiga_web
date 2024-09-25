import React, { useEffect, useState } from "react";
import "../css/ShopList.css";
import { URL } from "../App.js";
import { useAccessToken } from "../store/useStore.js";
import { useNavigate } from "react-router-dom";
import { getData } from "../api/Users.js";

const ShopList = () => {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useAccessToken().accessToken;

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await getData(`${URL}/api/v1/owner/store`, token);
        if (response.httpStatusCode === 200) {
          setShops(response.data); // 성공 시 데이터 설정
        } else {
          setError("Failed to fetch shops.");
        }
      } catch (error) {
        setError("Error fetching data: " + error.message); // 에러 처리
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchShops(); // 비동기 함수 호출
  }, [token]);

  const handleShopClick = (storeId) => {
    navigate(`/menuinsert/${storeId}`);
  };

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
            <div
              key={shop.storeId}
              className="shopItem"
              onClick={() => handleShopClick(shop.storeId)}
            >
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
