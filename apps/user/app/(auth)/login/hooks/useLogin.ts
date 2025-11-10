import { useApiErrorHandler } from "@user/hooks/useApiErrorHandler";
import { useModalStore } from "@user/store/modalStore";
import { loginApi } from "@user/lib/api/userAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * useLogin 훅
 * ----------------------------
 * 사용자 로그인 화면에서 사용할 상태와 로직을 관리하는 커스텀 훅
 *
 * @description
 * - 이메일과 비밀번호 입력 상태를 관리.
 * - 로그인 버튼 클릭 시 `loginApi`를 호출하여 인증을 시도.
 * - 로그인 성공 시 메인 페이지(`/`)로 이동.
 * - 실패 시 상태 코드에 따라 모달을 띄우거나 공통 에러 핸들러를 실행.
 *
 */
export function useLogin() {
  const { open } = useModalStore();
  const router = useRouter();
  const handleError = useApiErrorHandler();

  // --- 입력 상태 관리 ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * @description 이메일 입력 시 상태 업데이트
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  /**
   * @description 비밀번호 입력 시 상태 업데이트
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * @description 로그인 요청 처리
   * - 이메일/비밀번호를 `adminLoginApi`로 전송
   * - 성공 시 홈(`/`)으로 이동
   * - 실패 시 상태 코드에 따라 다른 모달 메시지 표시
   */
  const handleLogin = async () => {
    try {
      await loginApi(email, password);
      router.push("/");
    } catch (err: any) {
      if (err?.status == 401) {
        open("안내", "로그인에 실패했습니다.");
      } else {
        handleError(err);
      }
    }
  };

  return {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
  };
}
