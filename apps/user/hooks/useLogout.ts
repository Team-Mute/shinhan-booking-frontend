"use client";

import { useRouter } from "next/navigation"; // Next.js 라우터 훅
import { logoutApi } from "@user/lib/api/userAuth";
import { useAuthStore } from "@user/store/authStore";

/**
 * useLogout 훅
 * ----------------------
 * 사용자가 로그아웃할 때 사용하는 훅입니다.
 * - 서버 로그아웃 API 호출
 * - zustand 상태 초기화 및 localStorage 정리
 * - 로그인 페이지로 이동
 *
 * @returns {Object} logout 함수
 * @example
 * const { logout } = useLogout();
 * <button onClick={logout}>로그아웃</button>
 */
export function useLogout() {
  const router = useRouter(); // 페이지 이동을 위해 Next.js 라우터 훅 사용
  const logout = async () => {
    try {
      await logoutApi(); // 서버 로그아웃 요청

      useAuthStore.persist.clearStorage(); // zustand persist된 localStorage 제거
      useAuthStore.getState().clearAuth(); // zustand 메모리 상태 초기화
      localStorage.removeItem("user-auth"); // 로컬스토리지 안전하게 제거

      router.push("/login"); // 로그인 페이지로 이동
    } catch (e) {
      console.error("로그아웃 중 오류", e); // 오류 발생 시 콘솔에 출력
    }
  };

  return { logout }; // 호출 컴포넌트에서 사용 가능하도록 반환
}
