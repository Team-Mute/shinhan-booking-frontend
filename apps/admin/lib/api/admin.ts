import adminAxiosClient from "./adminAxiosClient";
import {
  AccountUpdateRequest,
  AccountDeleteRequest,
  AccountRoleUpdateRequest,
  PasswordUpdateRequest,
  PasswordResetRequest,
} from "@admin/types/dto/admin.dto";

// 관리자 정보 조회 API
export async function getAccountApi() {
  const { data } = await adminAxiosClient.get("/api/admin/account");
  return data;
}

// 관리자 정보 수정 API
export async function updateAccountApi(data: AccountUpdateRequest) {
  const { data: response } = await adminAxiosClient.put(
    "/api/admin/account",
    data
  );
  return response;
}

// 관리자 삭제 API
export async function deleteAccountApi(data: AccountDeleteRequest) {
  const { data: response } = await adminAxiosClient.delete(
    "/api/admin/account",
    { data }
  );
  return response;
}

// 관리자 권한 수정 API
export async function updateRolesApi(data: AccountRoleUpdateRequest) {
  const { data: response } = await adminAxiosClient.put(
    "/api/admin/account/roles",
    data
  );
  return response;
}

// 관리자 비밀번호 수정 API
export async function updatePasswordApi(data: PasswordUpdateRequest) {
  const { data: response } = await adminAxiosClient.put(
    "/api/admin/account/password",
    data
  );
  return response;
}

// 관리자 비밀번호 초기화 API
export async function resetAdminPasswordApi(data: PasswordResetRequest) {
  const { data: response, status } = await adminAxiosClient.post(
    "/api/admin/reset-password",
    data
  );
  return { response, status };
}
