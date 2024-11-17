import axios from "axios";
import store from "../store";
import { DELETE_TOKEN } from "../store/Auth";

const BASE_URL = "http://13.125.83.255:8080/api/v1/owner";

// 기본 axios
const axiosAPI = (options) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {},
    ...options,
  });

  // 인터셉터 설정
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // alert("로그인이 필요합니다.");
        window.location.href = "/login";
        store.dispatch(DELETE_TOKEN()); // 401 에러 발생 시 로그아웃 처리
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// 로그인 관련 axios
const userAxiosAPI = (options) => {
  const instance = axios.create({
    baseURL: BASE_URL + "/auth",
    headers: {},
    ...options,
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export const baseInstance = axiosAPI();
export const userInstance = userAxiosAPI();
