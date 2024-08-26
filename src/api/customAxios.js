import axios from 'axios';

const BASE_URL = 'http://13.125.83.255:8080';

// 로그인 관련 axios
const userAxiosAPI = (options) => {
    const instance = axios.create({
        baseURL: BASE_URL + '/api/v1/user/auth/login',
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

export const userInstance = userAxiosAPI();
