import { resetAdminPasswordApi } from "@admin/lib/api/admin";
import { useModalStore } from "@admin/store/modalStore";
import { useRouter } from "next/router";
import { useState } from "react";

/**
 * useResetPassword 훅
 * ----------------------------
 * 관리자 비밀번호 재설정 화면에서 사용할 상태와 로직을 관리하는 커스텀 훅.
 *
 * @description
 * - 이메일 입력값 관리.
 * - `resetAdminPasswordApi`를 호출하여 임시 비밀번호 발송.
 * - 요청이 성공하면 안내 모달을 띄우고 로그인 페이지(`/`)로 이동.
 * - 실패 시 에러 안내 모달 표시.
 */
export function useResetPassword() {
  const { open } = useModalStore();

  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleResetPW = async () => {
    try {
      const response = await resetAdminPasswordApi({ userEmail: email });

      if (response.status === 200) {
        open(
          "안내",
          "임시 비밀번호가 발송되었습니다.\n다시 로그인해주세요.",
          () => {
            router.push("/");
          }
        );
      }
    } catch (err: any) {
      if (err) {
        open("안내", "비밀번호 재설정 링크 전송에 실패했습니다.");
      }
    } finally {
    }
  };

  return {
    email,
    handleEmailChange,
    handleResetPW,
  };
}
