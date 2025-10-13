import { updatePasswordApi } from "@admin/lib/api/admin";
import { useLogout } from "@admin/lib/hooks/useLogout";
import { isValidPassword } from "@admin/lib/validators/password";
import { useModalStore } from "@admin/store/modalStore";
import { useState } from "react";

/**
 * useChangePW 훅
 * ----------------------------
 * 관리자 비밀번호 변경 페이지 관련 훅
 *
 * @description
 * - ChangePWPage의 상태 및 로직(ViewModel)을 관리.
 * - 폼 상태 관리 (현재 비밀번호, 새 비밀번호, 새 비밀번호 확인)
 */
export function useChangePW() {
  const { open } = useModalStore();
  const { logout } = useLogout();

  // --- 폼 상태 관리 ---
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- 입력값 유효성 검사 ---
  const isFormValid =
    password.trim() !== "" &&
    isValidPassword(newPassword) &&
    newPassword === confirmPassword;

  /**
   * 비밀번호 변경 요청 처리
   * -----------------------
   * 1. `updatePasswordApi`로 서버에 변경 요청
   * 2. 성공 시 모달 표시 및 로그아웃 후 로그인 페이지로 이동
   * 3. 500 오류 시 "현재 비밀번호 불일치" 안내 모달 표시
   */
  const handleSubmit = async () => {
    // 폼 유효성 미충족 시 종료
    if (!isFormValid) return;

    try {
      await updatePasswordApi({
        password: password,
        newPassword: newPassword,
      });

      open(
        "비밀번호 재설정 완료",
        "비밀번호가 재설정 완료되었습니다.\n다시 로그인 해주세요.",
        () => {
          logout();
        }
      );
    } catch (err) {
      if (err.status === 500) {
        open("안내", "현재 비밀번호가 일치하지 않습니다.");
      }
    }
  };

  return {
    password,
    newPassword,
    confirmPassword,
    isFormValid,

    setPassword,
    setNewPassword,
    setConfirmPassword,

    handleSubmit,
  };
}
