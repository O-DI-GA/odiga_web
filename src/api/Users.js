import { userInstance } from './customAxios';
import { SET_USER, DELETE_USER } from '../store/User';
import { SET_TOKEN, DELETE_TOKEN } from '../store/Auth';

// 로그인
export const postLogin = async (userInfo, dispatch) => {
    try {
        const response = await userInstance.post('/login', userInfo);
        if (response.status === 200) {
            // 학번, 이름, accessToken store에 저장
            const { studentName, accessToken } = response.data.data;
            dispatch(SET_USER({ studentName }));
            dispatch(SET_TOKEN({ accessToken }));
        }
        return true;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert('학번 또는 비밀번호가 일치하지 않습니다.');
        }
        return false;
    }
};

// 로그아웃
export const doLogout = (dispatch) => {
    dispatch(DELETE_TOKEN()); //accessToken store에서 제거
    dispatch(DELETE_USER()); // 사용자 이름 store에서 제거
};
