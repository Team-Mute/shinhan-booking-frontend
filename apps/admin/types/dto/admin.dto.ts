/**
 * AdminAccount 관련 DTO 모음
 *
 * - 조회 응답: AdminAccount
 * - 수정 요청: AdminAccountUpdate
 * - 삭제 요청: AdminAccountDelete
 * - 권한 수정 요청: AdminAccountRoleUpdate
 * - 비밀번호 수정 요청: AdminPasswordUpdate
 * - 비밀번호 초기화 요청: AdminPasswordReset
 */

/** 관리자 정보 조회 DTO */
export type AccountResponse = {
  roleId: number;
  regionName: string;
  userEmail: string;
  userName: string;
  userPhone: string;
};

/** 관리자 정보 수정 DTO (roleId 제외) */
export type AccountUpdateRequest = Omit<AccountResponse, "roleId">;

/** 관리자 삭제 DTO (이메일만 필요) */
export type AccountDeleteRequest = Pick<AccountResponse, "userEmail">;

/** 관리자 권한 수정 DTO */
export type AccountRoleUpdateRequest = {
  userEmail: string;
  roleId: number;
};

/** 관리자 비밀번호 수정 DTO */
export type PasswordUpdateRequest = {
  password: string;
  newPassword: string;
};

/** 관리자 비밀번호 초기화 DTO */
export type PasswordResetRequest = Pick<AccountResponse, "userEmail">;
