import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch } from "react-redux";
import { SET_STOREID } from "../store/User"; // Redux 액션 가져오기
import { getData } from "../api/Users"; // 데이터 가져오기 함수
import { useAccessToken } from "../store/useStore"; // 토큰 접근
import "../css/Header.css";

export default function SelectShop() {
  const dispatch = useDispatch();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [error, setError] = useState(null);

  const token = useAccessToken().accessToken;

  useEffect(() => {
    // 컴포넌트 마운트 시 가게 목록 불러오기
    const fetchShops = async () => {
      try {
        const response = await getData("/store", token);
        if (response.httpStatusCode === 200) {
          setShops(response.data);
          // 첫 번째 가게를 기본 선택값으로 설정
          if (response.data.length > 0) {
            const firstShop = response.data[0];
            setSelectedShop(firstShop.storeId);
            dispatch(SET_STOREID({ storeId: firstShop.storeId })); // 첫 번째 가게의 storeId를 Redux 스토어에 저장
          }
        } else {
          setError("가게 목록을 불러오는 데 실패했습니다.");
        }
      } catch (error) {
        setError("데이터를 불러오는 중 오류 발생: " + error.message);
      }
    };

    fetchShops();
  }, [token, dispatch]);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedShop(selectedId);
    dispatch(SET_STOREID({ storeId: selectedId })); // 선택된 가게의 storeId를 Redux 스토어에 업데이트
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="select-box">
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <Select
          value={selectedShop}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {shops.length === 0 ? (
            <MenuItem value="">
              <em>등록된 가게가 없습니다.</em>
            </MenuItem>
          ) : (
            shops.map((shop) => (
              <MenuItem key={shop.storeId} value={shop.storeId}>
                {shop.storeName}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </div>
  );
}
