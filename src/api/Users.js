import { baseInstance, userInstance } from "./customAxios";
import { SET_TOKEN, DELETE_TOKEN } from "../store/Auth";
import { DELETE_STOREID } from "../store/User";

// 로그인
export const postLogin = async (userInfo, dispatch) => {
  try {
    const response = await userInstance.post("/login", userInfo);
    if (response.status === 200) {
      // 이름 accessToken store에 저장
      const { accessToken } = response.data.data;
      dispatch(SET_TOKEN({ accessToken }));
    }
    return true;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // console.log(error.response.data.errorMessage);
      alert(error.response.data.errorMessage);
    }
    return false;
  }
};

// 로그아웃
export const doLogout = (dispatch) => {
  dispatch(DELETE_TOKEN()); //accessToken store에서 제거
  dispatch(DELETE_STOREID()); // 사용자 이름 store에서 제거
};

// 회원가입
export const postRegister = async (registerInfo) => {
  try {
    const response = await userInstance.post("/signup", registerInfo);
    if (response.status === 201) {
      alert("회원가입 성공!");
    }
    return true;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert(error.response.data.errorMessage);
    }
    return false;
  }
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

export const getRequest = async (url, token) => {
  try {
    const response = await baseInstance({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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

export const updateWithFileData = async (url, token, data) => {
  try {
    const response = await baseInstance({
      method: "PUT",
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
