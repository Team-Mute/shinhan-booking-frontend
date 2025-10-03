"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminProvider from "./AdminProvider";
import InfoModal from "@admin/components/modal/InfoModal";
import { AUTH_FREE_PAGES } from "@admin/lib/constants/routes";

/**
 * LayoutManager 컴포넌트
 * -----------------------
 * 앱 내 페이지별 레이아웃을 관리하는 최상위 컴포넌트.
 *
 * 1. AdminProvider : 관리자 관련 전역 상태 및 컨텍스트 제공
 * 2. InfoModal : 공통 모달 컴포넌트, 전역 상태로 열림/닫힘 제어
 * 3. 페이지 경로에 따른 레이아웃 분기
 *    - /login, /reset-password 페이지 : 사이드바 없이 children만 렌더링
 *    - 그 외 페이지 : AdminSidebar와 함께 children 렌더링
 *
 * @param children - 각 페이지의 실제 콘텐츠
 * @remarks
 * InfoModal은 모든 페이지에서 공통으로 렌더링되며,
 * 로그인 페이지는 사이드바 없이 단독으로 표시됨.
 */
export default function LayoutManager({ children }: Props) {
  const pathname = usePathname();
  const isAuthFreePage = AUTH_FREE_PAGES.includes(pathname);

  return (
    <AdminProvider>
      <InfoModal />
      {isAuthFreePage ? (
        <main>{children}</main>
      ) : (
        <AdminSidebar>{children}</AdminSidebar>
      )}
    </AdminProvider>
  );
}

type Props = {
  children: ReactNode;
};
