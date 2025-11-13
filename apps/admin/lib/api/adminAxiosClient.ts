import axios from "axios";
import { useAdminAuthStore } from "apps/admin/store/adminAuthStore";
import { useLoaderStore } from "apps/admin/store/loaderStore";
import { redirect } from "next/navigation";

const baseURL = "http://localhost:8080";

const adminAxiosClient = axios.create({
  baseURL: baseURL,
});

// --- Request Interceptor ---
adminAxiosClient.interceptors.request.use(
  (config) => {
    // ✅ 로딩 시작
    useLoaderStore.getState().startLoading();

    const token = useAdminAuthStore.getState().adminAccessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    useLoaderStore.getState().stopLoading(); // ✅ 실패 시에도 로딩 해제
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

adminAxiosClient.interceptors.response.use(
  (res) => {
    useLoaderStore.getState().stopLoading(); // ✅ 정상 응답 후 로딩 해제
    return res;
  },
  async (error) => {
    const { stopLoading } = useLoaderStore.getState();
    stopLoading(); // ✅ 에러 시에도 로딩 해제

    const originalRequest = error.config;
    const status = error.response?.status;

    // 토큰 만료 → refresh 시도
    if (
      status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/admin/auth/refresh") // ✅ refresh 요청은 재시도 금지
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = adminAxiosClient
          .post("/api/admin/auth/refresh", {}, { withCredentials: true })
          .then(({ data }) => {
            const { setAdminAccessToken } = useAdminAuthStore.getState();
            setAdminAccessToken(data.accessToken);
            isRefreshing = false;
            return data.accessToken;
          })
          .catch((err) => {
            isRefreshing = false;
            useAdminAuthStore.getState().clearAdminAuth();
            redirect("/login");
            throw err;
          });
      }

      // ✅ 다른 요청들은 refreshPromise 끝날 때까지 기다렸다가 재시도
      const newAccessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return adminAxiosClient(originalRequest);
    }

    // ✅ 공통 에러 처리 (서버 에러, 네트워크 에러 등)
    const errorMessage = mapErrorMessage(status);
    error.customMessage = errorMessage;

    return Promise.reject(error);
  }
);

export default adminAxiosClient;

// --- 공통 에러 메시지 매핑 ---
function mapErrorMessage(status?: number): string {
  switch (status) {
    case 400:
      return "잘못된 요청입니다.";
    case 401:
      return "인증이 필요합니다.";
    case 403:
      return "권한이 없습니다.";
    case 404:
      return "요청한 리소스를 찾을 수 없습니다.";
    case 500:
      return "서버 오류가 발생했습니다.";
    default:
      return "알 수 없는 오류가 발생했습니다.";
  }
}
