/**
 * =======================
 * userAuth.ts
 * 사용자 인증/계정 관련 API 모음
 * =======================
 *
 * 사용자 회원가입: signUpApi
 * 사용자 로그인/로그아웃: loginApi/logoutApi
 *
 */

import { useAuthStore } from "@user/store/authStore";
import { SignUpData } from "@user/types/user.dto";
import { getDeviceInfo } from "@user/utils/device";
import { getClientIp } from "@user/utils/ip";
import axiosClient from "@user/lib/api/axiosClient";

/**
 * @description 회원가입 API
 * @param {SignUpData} data - 사용자 이름, 이메일, 비밀번호, 회사명
 * @returns {Promise<any>} API 응답
 */
export async function signUpApi({
  userName,
  userEmail,
  userPwd,
  companyName,
}: SignUpData) {
  const response = await axiosClient.post("/api/users/signup", {
    userName,
    userEmail,
    userPwd,
    companyName,
  });
  return response;
}

/**
 * @description 로그인 API
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<any>} API 응답 (성공 시 accessToken 포함)
 * @throws {Error} 로그인 실패 시 에러 응답
 */
export async function loginApi(email: string, password: string) {
  const device = getDeviceInfo();
  const ip = await getClientIp();

  try {
    const response = await axiosClient.post("/api/auth/login", {
      email,
      password,
      device,
      ip,
    });

    useAuthStore.getState().setAccessToken(response.data.accessToken);
    return response;
  } catch (error: any) {
    // axios는 자동으로 error.response를 넘겨줌
    throw error.response || error;
  }
}

/**
 * @description 로그아웃 API
 * @returns {Promise<void>}
 * @throws {Error} 로그아웃 실패 시 에러
 */
export async function logoutApi() {
  const token = useAuthStore.getState().accessToken;
  try {
    await axiosClient.post(
      "/api/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    useAuthStore.getState().clearAuth();
  } catch (error) {
    throw new Error("로그아웃 실패");
  }
}
