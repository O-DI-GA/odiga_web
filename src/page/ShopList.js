import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ShopList.css";

const ShopList = () => {
  const [shops, setShops] = useState([
    {
      storeId: 1,
      storeName: "odiga",
      address: "odegano",
      phoneNumber: "123456789",
      reviewCount: 0,
      storeCategory: null,
    },
    {
      storeId: 2,
      storeName: "shop2",
      address: "add",
      phoneNumber: "123456789",
      reviewCount: 1,
      storeCategory: "한식",
    },
    {
      storeId: 3,
      storeName: "shop3",
      address: "add",
      phoneNumber: "123456789",
      reviewCount: 1,
      storeCategory: "한식",
    },
    {
      storeId: 4,
      storeName: "엄청 긴 가게 이름이름이름의르이ㅡ밍리을이믬의으미을미",
      address: "add",
      phoneNumber: "123456789",
      reviewCount: 1,
      storeCategory: "한식",
    },
    {
      storeId: 5,
      storeName: "shop5",
      address: "대구광역시 ㅇ구 ㅇㅇ동 어쩌구 저쩌구 긴 주소",
      phoneNumber: "123456789",
      reviewCount: 1,
      storeCategory: "한식",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
