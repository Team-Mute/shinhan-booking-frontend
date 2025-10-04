"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAdminAuthStore } from "@admin/store/adminAuthStore";

/**
 * AdminProvider 컴포넌트
 * -----------------------
 * 관리자 페이지 접근 권한을 체크하고,
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트 처리.
 *
 * 1. Zustand persist 복원 완료 여부 확인.
 * 2. `adminAccessToken` 존재 여부로 로그인 상태 판별.
 * 3. 인증 필요 페이지 접근 시 토큰이 없으면 `/login`으로 이동 처리.
 * 4. 루트(`/`) 접근 시 `/dashboard`로 리다이렉트 처리.
 * 5. `/login`, `/reset-password` 페이지는 예외로 접근 허용.
 * 6. persist 복원 전 또는 권한 확인 중에는 빈 화면으로 렌더링 제어.
 */
export default function AdminProvider({ children }: { children: ReactNode }) {
  // Next.js 라우팅 관련 훅
  const router = useRouter();
  const pathname = usePathname();

  // Zustand 스토어에서 인증 관련 상태 조회
  const adminAccessToken = useAdminAuthStore((state) => state.adminAccessToken);
  const hasHydrated = useAdminAuthStore.persist?.hasHydrated ?? false;

  // 권한 상태: null = 체크 중 / true = 통과 / false = 거부
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  /**
   *  라우트 및 인증 상태 변화 감지
   * - persist 복원이 끝나면 실행
   * - 로그인 상태 및 현재 경로에 따라 리다이렉트 처리
   */
  useEffect(() => {
    if (!hasHydrated) return; // persist 복원 전이면 대기

    // (1) 루트(/) 접근 시 대시보드로 리다이렉트
    if (pathname === "/") {
      router.replace("/dashboard");
      setAuthorized(true);
      return;
    }

    // (2) 로그인/비밀번호 재설정 페이지는 항상 접근 허용
    if (pathname === "/login" || pathname === "/reset-password") {
      setAuthorized(true);
      return;
    }

    // (3) 토큰이 있으면 인증 통과, 없으면 로그인 페이지로 이동
    if (adminAccessToken) {
      setAuthorized(true);
    } else {
      router.replace("/login");
      setAuthorized(false);
    }
  }, [hasHydrated, pathname, adminAccessToken, router]);

  /**
   * 렌더링 제어
   * - persist 복원 전 또는 권한 상태 확인 중에는 숨김 처리
   * - 깜빡임 방지용으로 visibility를 hidden으로 설정
   */
  if (!hasHydrated || authorized === null) {
    return <div style={{ visibility: "hidden" }} />;
  }

  // 권한 확인 완료 후 children 렌더링
  return <>{children}</>;
}
