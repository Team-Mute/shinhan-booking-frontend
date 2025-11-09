import axiosClient from "./axiosClient";
import {
  AccountUpdateBody,
  PasswordUpdateBody,
  PasswordResetBody,
  CheckEmailParams,
} from "@user/types/user.dto";

// 사용자 정보 조회 API
export async function getAccountApi() {
  const { data } = await axiosClient.get("/api/users/account");
  return data;
}

// 사용자 정보 수정 API
export async function updateAccountApi(data: AccountUpdateBody) {
  const { data: response } = await axiosClient.put("/api/users/account", data);
  return response;
}

// 사용자 삭제 API
export async function deleteAccountApi() {
  const { data: response } = await axiosClient.delete("/api/users/account", {});
  return response;
}

// 사용자 비밀번호 수정 API
export async function updatePasswordApi(data: PasswordUpdateBody) {
  const { data: response } = await axiosClient.put(
    "/api/users/account/password",
    data
  );
  return response;
}

// 사용자 비밀번호 초기화 API
export async function resetPasswordApi(data: PasswordResetBody) {
  const { data: response, status } = await axiosClient.post(
    "/api/users/reset-password",
    data
  );
  return { response, status };
}

// 이메일 중복 체크 API
export async function checkEmail(paramsData: CheckEmailParams) {
  const { data: response } = await axiosClient.get("/api/users/check-email", {
    params: paramsData,
  });
  return response;
}
