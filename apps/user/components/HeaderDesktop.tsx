"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { media } from "@styles/breakpoints";
import { useAuthStore } from "@user/store/authStore";
import { useRouter } from "next/navigation";
import { useLogout } from "@user/hooks/useLogout";

/**
 * HeaderDesktop 컴포넌트
 * ----------------------
 * 데스크탑 화면에서만 보이는 상단 헤더.
 *
 * 1. HeaderWrapper : 헤더 영역 전체를 감싸는 styled 컴포넌트
 * 2. <Link href="/"> : 로고 클릭 시 공간 검색 메인 페이지로 이동
 * 3. Logo : 로고 이미지 표시
 *
 * @remarks
 * - 모바일 화면에서는 display:none 처리됨
 */
export default function HeaderDesktop() {
  const { accessToken } = useAuthStore();
  const router = useRouter();
  const { logout } = useLogout(); // ✅ 훅 호출해서 logout 함수 가져옴

  return (
    <>
      <HeaderWrapper>
        <Left>
          <Link href="/">
            <Logo src="/logo/shinhanfoundation.svg" alt="로고" />
          </Link>
        </Left>
        <Right>
          {accessToken ? (
            <NavButton
              onClick={() => {
                router.push("/mypage/reservations");
              }}
            >
              마이페이지
            </NavButton>
          ) : (
            <NavButton aria-disabled={true}></NavButton>
          )}
          {accessToken ? (
            <NavButton onClick={logout}>로그아웃</NavButton>
          ) : (
            <NavButton
              onClick={() => {
                router.push("/login");
              }}
            >
              로그인
            </NavButton>
          )}
        </Right>
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
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
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

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    display: none; // 모바일에서는 숨김
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: black;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
`;
