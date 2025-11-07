import axios from "axios";
import { useAuthStore } from "@user/store/authStore";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: baseURL,
  withCredentials: true, // 쿠키 전송
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 401, 403 대상이면서 refresh 요청이 아닌 경우
    if (
      (status === 401 || status === 403) &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/users/signup") &&
      !originalRequest.url.includes("/users/logout") &&
      !originalRequest.url.includes("/sms/") &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // refresh 시도
          const { data } = await axiosClient.post("/api/auth/refresh");
          useAuthStore.getState().setAccessToken(data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosClient(originalRequest);
        } catch (err) {
          // refresh 실패 → 로그아웃
          useAuthStore.getState().clearAuth();
          window.location.href = "/login";
          return Promise.reject(err);
        }
      } else {
        // 이미 retry 시도 → 로그아웃
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
