"use client";

import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  FOOTER_FREE_PAGES,
  HEADER_FREE_PAGES,
} from "@user/lib/constants/routes";
import UserProvider from "./UserProvider";
import InfoModal from "@user/components/InfoModal";
import FooterDesktop from "@user/components/FooterDesktop";
import FooterMobile from "@user/components/FooterMobile";
import HeaderDesktop from "@user/components/HeaderDesktop";
import HeaderMobile from "@user/components/HeaderMobile";
import styled from "@emotion/styled";

/**
 * LayoutManager 컴포넌트
 * -----------------------
 * 앱 내 페이지별 레이아웃을 관리하는 최상위 컴포넌트.
 *
 * @property {ReactNode} children 페이지 콘텐츠.
 * @remarks
 * - UserProvider를 통해 전역 사용자 상태 관리.
 * - InfoModal을 통해 전역 알림/정보 모달 표시.
 * - FOOTER_FREE_PAGES에 속하는 경로는 푸터(Footer)를 숨김 처리.
 */
export default function LayoutManager({ children }: Props) {
  // 현재 URL 경로 가져오기
  const pathname = usePathname();

  // 현재 경로가 푸터가 필요 없는 페이지 목록에 포함되는지 확인
  const isHeaderFreePage = useMemo(() => {
    return HEADER_FREE_PAGES.some((freePath) =>
      // 현재 경로(pathname)가 HEADER_FREE_PAGES의 항목으로 시작하는지 확인
      pathname.startsWith(freePath)
    );
  }, [pathname]);

  // 현재 경로가 푸터가 필요 없는 페이지 목록에 포함되는지 확인
  const isFooterFreePage = useMemo(() => {
    return FOOTER_FREE_PAGES.some((freePath) =>
      // 현재 경로(pathname)가 FOOTER_FREE_PAGES의 항목으로 시작하는지 확인
      pathname.startsWith(freePath)
    );
  }, [pathname]);

  return (
    <UserProvider>
      <InfoModal /> {/* 전역 알림 모달 */}
      {isHeaderFreePage ? (
        <></>
      ) : (
        <>
          <HeaderDesktop />
          <HeaderMobile />
        </>
      )}
      <PageWrapper>
        <main>{children}</main> {/* 실제 페이지 콘텐츠 */}
      </PageWrapper>
      {/* 푸터 조건부 렌더링 */}
      {isFooterFreePage ? (
        <></> // 푸터가 필요 없는 페이지는 렌더링 안 함
      ) : (
        <>
          <FooterDesktop /> {/* 데스크탑 푸터 */}
          <FooterMobile /> {/* 모바일 푸터 */}
        </>
      )}
    </UserProvider>
  );
}

type Props = {
  children: ReactNode;
};

const PageWrapper = styled.div`
  display: flex;
  margin-top: var(--header-height);
`;
