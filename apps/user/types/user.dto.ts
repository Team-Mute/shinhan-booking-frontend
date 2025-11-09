/**
 * UserAccount 관련 DTO 모음
 *
 * - 조회 응답: AccountResponse
 * - 수정 요청: AccountUpdateBody
 * - 비밀번호 수정 요청: PasswordUpdateBody
 * - 비밀번호 초기화 요청: PasswordResetBody
 *
 * - 회원가입 요청 및 응답: SignupData, SignupResponse
 * - 이메일 중복 확인 요청: CheckEmailParams
 */

/** 사용자 정보 조회 DTO */
export type AccountResponse = {
  userId: number;
  roleId: number;
  companyId: number;
  userEmail: string;
  userName: string;
  regDate: string;
  updDate: string;
  agreeEmail: boolean;
  companyName: string;
  roleName: string;
};

/** 사용자 정보 수정 DTO */
export type AccountUpdateBody = Pick<
  AccountResponse,
  "userEmail" | "userName" | "agreeEmail"
>;

/** 사용자 비밀번호 수정 DTO */
export type PasswordUpdateBody = {
  password: string;
  newPassword: string;
};

/** 사용자 비밀번호 초기화 DTO */
export type PasswordResetBody = Pick<AccountResponse, "userEmail">;

/** 사용자 회원가입 요청 DTO */
export type SignUpData = {
  userName: string;
  userEmail: string;
  userPwd: string;
  companyName: string;
  agreeEmail: boolean;
};

/** 사용자 회원가입 응답 DTO */
export type SignUpResponse = {
  message: string;
  userId: number;
  roleId: number;
};

/** 이메일 중복 체크 요청 DTO */
export type CheckEmailParams = {
  email: string;
};
