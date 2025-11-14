"use client";

import styled from "@emotion/styled";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import colors from "@styles/theme";
import { media } from "@styles/breakpoints";

import { useLogout } from "@user/hooks/useLogout";
import { useAuthStore } from "@user/store/authStore";
import { useRouter } from "next/navigation";
/**
 * HeaderMobile 컴포넌트
 * ----------------------
 * 모바일 화면에서만 보이는 상단 헤더.
 *
 * 1. 토큰 존재 시에만 (로그인 시에만) 햄버거 메뉴 버튼 활성화
 * 2. menuOpen 상태에 따라 메뉴 오버레이 표시
 * 3. 메뉴 항목 클릭 시 메뉴 닫기 및 페이지 이동
 * 4. 로그아웃 버튼 클릭 시 logoutApi 호출 후 로그인 페이지로 이동
 */
export default function HeaderMobile() {
  const { logout } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const { accessToken } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <>
      <HeaderWrapper>
        <Link href="/spaces">
          <Logo src="/logo/shinhanfoundation.svg" alt="로고" />
        </Link>

        {/* 햄버거 메뉴 버튼 (토큰 있을 때만 활성화) */}
        <HamburgerButton
          onClick={() => setMenuOpen(true)} // 메뉴 열림
          disabled={false}
          hidden={false}
        >
          <HamburgerIcon src="/icons/threeline.svg" alt="메뉴" />
        </HamburgerButton>
      </HeaderWrapper>

      {/* 메뉴 오버레이 (menuOpen 상태일 때만 표시) */}
      {menuOpen && (
        <Overlay>
          {/* 닫기 버튼 */}
          <CloseButton onClick={() => setMenuOpen(false)}>
            <IoClose size={28} />
          </CloseButton>
          <MenuList>
            {/* 마이페이지 링크 (로그인 시에만) */}
            {accessToken ? (
              <MenuLink
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/mypage"); // 마이페이지 이동
                }}
              >
                마이페이지
              </MenuLink>
            ) : (
              <></> // 비로그인 시 표시 안 함
            )}
            {/* 로그아웃/로그인 링크 */}
            {accessToken ? (
              <MenuLink
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout(); // 로그아웃 처리
                }}
              >
                로그아웃
              </MenuLink>
            ) : (
              <MenuLink
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/login"); // 로그인 페이지 이동
                }}
              >
                로그인
              </MenuLink>
            )}
          </MenuList>
        </Overlay>
      )}
    </>
  );
}

// --- styled ---
const HeaderWrapper = styled.header`
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

  /* 모바일 이상에서는 숨김 */
  ${media.mobileUp} {
    display: none;
  }
`;

const Logo = styled.img`
  height: 20px;
`;

const HamburgerButton = styled.button<{ hidden: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  display: ${({ hidden }) => (hidden ? "none" : "inline-flex")};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 1000;
  padding: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const MenuList = styled.nav`
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
`;

const MenuLink = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 16px;
  color: ${colors.graycolor100};
  text-decoration: none;
  height: 3.5rem;
  padding-left: 1rem;
`;

const HamburgerIcon = styled.img`
  width: 24px;
  height: 24px;
`;
