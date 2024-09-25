import { baseInstance, userInstance } from "./customAxios";
import { SET_USER, DELETE_USER } from "../store/User";
import { SET_TOKEN, DELETE_TOKEN } from "../store/Auth";

// 로그인
export const postLogin = async (userInfo, dispatch) => {
  try {
    const response = await userInstance.post("/login", userInfo);
    if (response.status === 200) {
      // 이름 accessToken store에 저장
      const { ownerName, accessToken } = response.data.data;
      dispatch(SET_USER({ ownerName }));
      dispatch(SET_TOKEN({ accessToken }));
    }
    return true;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("비밀번호가 일치하지 않습니다.");
    }
    if (error.response && error.response.status === 404) {
      alert("존재하지 않는 계정입니다.");
    }
    return false;
  }
};

// 로그아웃
export const doLogout = (dispatch) => {
  dispatch(DELETE_TOKEN()); //accessToken store에서 제거
  dispatch(DELETE_USER()); // 사용자 이름 store에서 제거
};

/* 토큰 필요 API 통신 */
// GET
export const getData = async (url, token, data) => {
  try {
    const response = await baseInstance({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST
export const postData = async (url, token, data) => {
  try {
    const response = await baseInstance({
      method: "POST",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postWithFileData = async (url, token, data) => {
  try {
    const response = await baseInstance({
      method: "POST",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//UPDATE
export const updateData = async (url, token, data) => {
  try {
    const response = await baseInstance({
      method: "PUT",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//DELETE
export const deleteData = async (url, token, data) => {
  try {
    const response = await baseInstance({
      method: "DELETE",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
