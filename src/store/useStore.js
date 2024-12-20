import { useSelector } from "react-redux";

// acessToken 반환
export function useAccessToken() {
  const accessToken = useSelector((state) => state.authToken.accessToken);
  return accessToken || "";
}

// authenticated 반환 (로그인 여부)
export function useAuthenticated() {
  const authenticated = useSelector((state) => state.authToken.authenticated);
  return authenticated;
}

// storeID 반환
export function useStoreId() {
  const storeId = useSelector((state) => state.storeInfo.storeId);
  return storeId || "";
}
