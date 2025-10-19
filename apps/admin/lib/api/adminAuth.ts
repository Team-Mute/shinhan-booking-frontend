/** adminAuth.ts
 *
 * 관리자 회원가입: adminSignUpApi
 * 관리자 로그인/로그아웃: adminLoginApi/adminLogoutApi
 *
 */

import { AdminSignUpData } from "apps/admin/store/adminAuthStore";
import adminAxiosClient from "./adminAxiosClient";
import { useAdminAuthStore } from "apps/admin/store/adminAuthStore";

// 관리자 회원가입 API
export async function adminSignUpApi({
  roleId,
  regionName,
  userEmail,
  userName,
  userPhone,
}: AdminSignUpData) {
  const response = await adminAxiosClient.post("/api/admin/signup", {
    roleId,
    regionName,
    userEmail,
    userName,
    userPhone,
  });
  return response;
}

// 관리자 로그인 API
export async function adminLoginApi(email: string, password: string) {
  try {
    const response = await adminAxiosClient.post(
      "/api/admin/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const { accessToken, roleId } = response.data;

    const store = useAdminAuthStore.getState();
    store.setAdminAccessToken(accessToken);
    store.setAdminRoleId(roleId);

    return response;
  } catch (error: any) {
    throw error.response || error;
  }
}

// 관리자 로그아웃 API
export async function adminLogoutApi() {
  try {
    await adminAxiosClient.post("/api/admin/auth/logout", {});
  } catch (error: any) {
    throw error.response || error;
  }
}
