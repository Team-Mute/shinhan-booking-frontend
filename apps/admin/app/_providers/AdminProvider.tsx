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
 * 1. _hasHydrated: persist 복원이 끝날 때까지 기다림
 * 2. adminAccessToken: 로그인 여부
 * 3. 로그인 페이지는 토큰 없어도 접근 허용
 */
export default function AdminProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminAccessToken } = useAdminAuthStore();
  const [authorized, setAuthorized] = useState<null | boolean>(null);

  useEffect(() => {
    if (!useAdminAuthStore.persist.hasHydrated) return; // persist 준비 전에는 아무것도 안 함

    if (pathname === "/login" || pathname === "/reset-password") {
      setAuthorized(true);
      return;
    }

    if (!adminAccessToken && pathname != "/reset-password") {
      router.replace("/login");
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [pathname, adminAccessToken, router]);

  // persist 완료 전 혹은 권한 체크 중에는 빈 div
  if (!useAdminAuthStore.persist.hasHydrated || authorized === null) {
    return <div style={{ visibility: "hidden" }} />;
  }

  // 권한 체크 완료 후 children 렌더링
  return <main>{children}</main>;
}
