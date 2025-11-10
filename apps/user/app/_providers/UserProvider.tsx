"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@user/store/authStore";
import { AUTH_FREE_PAGES } from "@user/lib/constants/routes";

/**
 * UserProvider 컴포넌트
 * -----------------------
 * 사용자 인증 상태를 확인하고, 인증되지 않은 사용자의 접근을 제어하여
 * 필요한 경우 로그인 페이지로 리다이렉트 처리하는 최상위 보호 컴포넌트.
 *
 * @property {ReactNode} children 내부 컴포넌트 콘텐츠.
 */
export default function UserProvider({ children }: { children: ReactNode }) {
  // Next.js 라우팅 관련 훅
  const router = useRouter();
  const pathname = usePathname();

  // 인증이 필요 없는 페이지인지 확인
  // const isAuthFreePage = AUTH_FREE_PAGES.includes(pathname);

  // Zustand 스토어에서 인증 관련 상태 및 persist 복원 상태 조회
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore.persist?.hasHydrated ?? false;

  // 인증/권한 확인 진행 상태
  const [isChecking, setIsChecking] = useState(false); // persist 복원 완료 여부 (라우팅 로직 실행 준비)
  const [authorized, setAuthorized] = useState<boolean | null>(null); // null = 체크 중 / true = 통과 / false = 거부

  // 인증이 필요 없는 페이지인지 확인
  const isAuthFreePage = useMemo(() => {
    // Array.some()을 사용하여 배열의 항목 중 하나라도 조건(startsWith)을 만족하는지 검사
    return AUTH_FREE_PAGES.some((freePath) =>
      // 현재 경로(pathname)가 AUTH_FREE_PAGES의 항목(freePath)으로 시작하는지 확인
      pathname.startsWith(freePath)
    );
  }, [pathname]);

  /**
   * (1) Zustand persist 복원 완료 시 라우팅 로직 실행 준비
   */
  useEffect(() => {
    if (hasHydrated) {
      // Zustand 스토어의 데이터 복원(Hydration)이 완료되면
      setIsChecking(true); // 라우팅/인증 체크를 시작할 준비 완료
    }
  }, [hasHydrated]);

  /**
   * (2) persist 복원 완료 후 라우팅 및 인증 처리 로직
   */
  useEffect(() => {
    if (!isChecking) {
      return; // persist 복원 완료 전에는 동작 안 함
    }

    // (2-2) 인증이 필요 없는 페이지는 즉시 접근 허용
    if (isAuthFreePage) {
      setAuthorized(true);
      return;
    }

    // (2-3) 인증이 필요한 페이지 (isAuthFreePage === false) 처리
    if (!isAuthFreePage) {
      // 접근 토큰이 없는 경우: 로그인 페이지로 리다이렉트
      if (!accessToken) {
        router.replace("/login"); // 로그인 페이지로 이동시키고
        setAuthorized(false); // 접근 거부 상태로 설정
      } else {
        setAuthorized(true); // 접근 토큰이 있는 경우: 접근 허용
      }
    }
  }, [isChecking, pathname, accessToken, router]);

  /**
   * (3) persist 복원 전 또는 권한 확인 중에는 자식 컴포넌트 렌더링을 막음
   */
  if (!isChecking || authorized === null) {
    // 렌더링을 막아 화면 깜빡임/순간적인 콘텐츠 노출 방지
    return <div style={{ visibility: "hidden" }} />;
  }

  // 인증 통과 시 자식 컴포넌트 렌더링
  return <>{children}</>;
}
