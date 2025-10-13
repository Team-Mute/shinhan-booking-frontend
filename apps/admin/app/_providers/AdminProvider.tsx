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
 * 처리 흐름:
 * 1. Zustand persist 복원 완료 여부 확인.
 * 2. 복원이 끝나면 라우팅 로직 시작.
 * 3. 루트('/') 접근 시 '/dashboard'로 리다이렉트.
 * 4. '/login', '/reset-password' 페이지는 예외적으로 접근 허용.
 * 5. 인증이 필요한 페이지에서 토큰이 없으면 '/login'으로 이동.
 * 6. persist 복원 전 또는 권한 확인 중에는 화면 렌더링을 숨김 처리.
 */
export default function AdminProvider({ children }: { children: ReactNode }) {
  // Next.js 라우팅 관련 훅
  const router = useRouter();
  const pathname = usePathname();

  // Zustand 스토어에서 인증 관련 상태 조회
  const adminAccessToken = useAdminAuthStore((state) => state.adminAccessToken);
  const hasHydrated = useAdminAuthStore.persist?.hasHydrated ?? false;

  // persist 복원 및 권한 확인 상태
  const [isChecking, setIsChecking] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null); // null = 체크 중 / true = 통과 / false = 거부

  /**
   * (1) Zustand persist 복원 완료 시 라우팅 로직 실행 준비
   */
  useEffect(() => {
    if (hasHydrated) {
      setIsChecking(true);
    }
  }, [hasHydrated]);

  /**
   * (2) persist 복원 완료 후 라우팅 및 인증 처리
   */
  useEffect(() => {
    if (!isChecking) {
      return; // persist 복원이 완료되기 전에는 아무 동작도 수행하지 않음
    }

    // (2-1) 루트('/') 접근 시 '/dashboard'로 이동
    if (pathname === "/") {
      router.replace("/dashboard");
      setAuthorized(true);
      return;
    }

    // (2-2) 로그인/비밀번호 재설정 페이지는 접근 허용
    if (pathname === "/login" || pathname === "/reset-password") {
      setAuthorized(true);
      return;
    }

    // (2-3) 인증 토큰이 없으면 로그인 페이지로 리다이렉트
    if (adminAccessToken) {
      setAuthorized(true);
    } else {
      router.replace("/login");
      setAuthorized(false);
    }
  }, [isChecking, pathname, adminAccessToken, router]);

  /**
   * (3) persist 복원 전 또는 권한 확인 중에는 화면 렌더링 차단
   */
  if (!isChecking || authorized === null) {
    return <div style={{ visibility: "hidden" }} />;
  }

  return <>{children}</>;
}
