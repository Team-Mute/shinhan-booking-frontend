"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { media } from "@styles/breakpoints";

/**
 * HeaderDesktop 컴포넌트
 * ----------------------
 * 데스크탑 화면에서만 보이는 상단 헤더.
 *
 * 1. HeaderWrapper : 헤더 영역 전체를 감싸는 styled 컴포넌트
 * 2. <Link href="/dashboard"> : 로고 클릭 시 대시보드 페이지로 이동
 * 3. Logo : 로고 이미지 표시
 *
 * @remarks
 * - 모바일 화면에서는 display:none 처리됨
 */
export default function HeaderDesktop() {
  return (
    <>
      <HeaderWrapper>
        <Link href="/dashboard">
          <Logo src="/logo/shinhanfoundation.svg" alt="로고" />
        </Link>
      </HeaderWrapper>
    </>
  );
}

// --- styled ---
const HeaderWrapper = styled.header`
  display: none;

  /* 모바일 이상에서만 보임 */
  ${media.mobileUp} {
    width: 100%;
    height: var(--header-height);
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
`;

const Logo = styled.img`
  height: 20px;
`;
