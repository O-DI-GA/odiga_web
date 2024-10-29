import React, { useState, useRef, useEffect } from "react";
import { useAccessToken } from "../store/useStore";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { getData, updateWithFileData } from "../api/Users";
import { useParams } from "react-router-dom";

export default function UpdateStore() {
  const { accessToken: token } = useAccessToken();
  const { id: storeId } = useParams();
  const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const [storeData, setStoreData] = useState({});
  const [images, setImages] = useState({
    storeTitleImage: null, 
    storeImage: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const titleImgRef = useRef();
  const storeImgRef = useRef();

  // 가게 정보 불러오기
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const { data } = await getData(`/store/${storeId}`, token);
        setStoreData(data);
        console.log(data);
      } catch (error) {
        console.error("가게 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchStoreData();
  }, [storeId, token]);

  // 입력값이 변경될 때 바로 storeData를 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({
      ...prev,
      [name]: value, // 입력된 값을 storeData에 바로 반영
    }));
  };

  // 이미지 파일 처리
  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({
        ...prev,
        [fieldName]: file, // 이미지를 파일로 저장
      }));
    }
  };

  // 주소를 위도와 경도로 변환하여 FormData에 추가하는 함수
  const fetchLatLng = async (address, formData) => {
    try {
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: googleApiKey,
          },
        }
      );

      if (geocodeResponse.data.results.length > 0) {
        const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
        console.log("latitude:", lat, "longitude:", lng);

        // FormData에 latitude와 longitude 추가
        formData.append("longitude", lng); // 경도
        formData.append("latitude", lat); // 위도
      } else {
        alert("유효한 주소를 입력해주세요.");
      }
    } catch (error) {
      alert("주소를 변환하는 중 오류가 발생했습니다.");
    }
  };

  // storeData를 FormData로 변환하여 전송하는 함수
  const prepareFormData = async () => {
    const formData = new FormData();
    for (const key in storeData) {
      // latitude와 longitude는 나중에 추가되므로 제외
      if (key !== "latitude" && key !== "longitude") {
        if (
          (key === "storeTitleImage" || key === "storeImage") &&
          !images[key]
        ) {
          // 파일이 아닌 URL인 경우 formData에 추가하지 않음
          continue;
        }
        formData.append(key, storeData[key]);
      }
    }

    // 파일이 변경된 경우에만 FormData에 추가
    if (images.storeTitleImage) {
      formData.append("storeTitleImage", images.storeTitleImage); // 대표 이미지 파일 추가
    }

    if (images.storeImage) {
      formData.append("storeImage", images.storeImage); // 가게 이미지 파일 추가
    }

    // 주소가 있을 경우 위도와 경도를 추가
    if (storeData.address) {
      await fetchLatLng(storeData.address, formData);
    }

    return formData;
  };

  // 폼 제출 시 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = await prepareFormData(); // FormData 객체로 변환

    printFormData(formData); // formData 객체를 { key: value } 형태로 출력

    try {
      await updateWithFileData(`/store/${storeId}`, token, formData);
      alert("가게 정보가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("가게 정보를 업데이트하는 중 오류 발생:", error);
      alert("가게 정보 업데이트에 실패했습니다.");
    }
  };

  // formData 객체를 출력하는 함수
  const printFormData = (formData) => {
    const formObject = {};
    for (const [key, value] of formData.entries()) {
      formObject[key] = value;
    }
    console.log(formObject); // { key: value } 형태로 출력
  };

  // 수정 모드 변경 함수
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <h3>가게 정보 수정</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Row>
            <Form.Label>
              <b>가게 이름</b>
            </Form.Label>
            {!isEditing ? (
              <p>{storeData.storeName || "가게 이름 없음"}</p>
            ) : (
              <Form.Control
                name="storeName"
                placeholder={storeData.storeName}
                onChange={handleInputChange}
              />
            )}
          </Row>
        </Form.Group>
        <Form.Group className="mb-3">
          <Row>
            <Form.Label>
              <b>카테고리</b>
            </Form.Label>
            {!isEditing ? (
              <p>{storeData.storeCategory || "카테고리 없음"}</p>
            ) : (
              <Form.Control
                name="storeCategory"
                placeholder={storeData.storeCategory}
                onChange={handleInputChange}
              />
            )}
          </Row>
        </Form.Group>
        <Form.Group className="mb-3">
          <Row>
            <Form.Label>
              <b>주소</b>
            </Form.Label>
            {!isEditing ? (
              <p>{storeData.address || "주소 없음"}</p>
            ) : (
              <Form.Control
                name="address"
                placeholder={storeData.address}
                onChange={handleInputChange}
              />
            )}
          </Row>
        </Form.Group>
        <Form.Group className="mb-3">
          <Row>
            <Form.Label><b>전화번호</b></Form.Label>
            {!isEditing ? (
              <p>{storeData.phoneNumber || "전화번호 없음"}</p>
            ) : (
              <Form.Control
                name="phoneNumber"
                placeholder={storeData.phoneNumber}
                onChange={handleInputChange}
              />
            )}
          </Row>
        </Form.Group>
        <Form.Group className="mb-3">
          <Row>
            <Form.Label><b>테이블 수</b></Form.Label>
            {!isEditing ? (
              <p>{storeData.tableCount || "테이블 수 없음"}</p>
            ) : (
              <Form.Control
                name="tableCount"
                placeholder={storeData.tableCount}
                onChange={handleInputChange}
              />
            )}
          </Row>
        </Form.Group>

        {/* 대표 사진 */}
        <Form.Group className="mb-3">
          <Row>
            <Form.Label><b>대표 사진</b></Form.Label>
            <div>
              <img
                src={storeData.storeTitleImage}
                alt="대표 사진 미리보기"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  ref={titleImgRef}
                  onChange={(e) => handleImageChange(e, "storeTitleImage")}
                  style={{ marginTop: "10px" }}
                />
              )}
            </div>
          </Row>
        </Form.Group>

        {/* 가게 사진 */}
        <Form.Group className="mb-3">
          <Row>
            <Form.Label><b>가게 사진</b></Form.Label>
            <div>
              <img
                src={storeData.storeImage}
                alt="가게 사진 미리보기"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  ref={storeImgRef}
                  onChange={(e) => handleImageChange(e, "storeImage")}
                  style={{ marginTop: "10px" }}
                />
              )}
            </div>
          </Row>
        </Form.Group>

        {/* 수정 버튼 */}
        {isEditing ? (
          <>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={handleEditClick}
            >
              취소
            </Button>
            <Button variant="primary" type="submit">
              저장
            </Button>
          </>
        ) : (
          <Button variant="primary" type="button" onClick={handleEditClick}>
            수정하기
          </Button>
        )}
      </Form>
    </div>
  );
}
