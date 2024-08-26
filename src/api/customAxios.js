import axios from "axios";

const BASE_URL = "http://13.125.83.255:8080/api/v1/owner";

// 기본 axios
const axiosAPI = (options) => {
  const instance = axios.create({
    baseURL: BASE_URL,
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
