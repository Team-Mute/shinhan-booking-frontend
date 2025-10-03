"use client";

import styled from "@emotion/styled";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import colors from "@styles/theme";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@admin/store/adminAuthStore";
import { media } from "@styles/breakpoints";
import {
  DashboardIcon,
  ReservationIcon,
  SpaceIcon,
  AddUserIcon,
  LogoutIcon,
} from "@admin/icons";
import { useLogout } from "@admin/lib/hooks/useLogout";
/**
 * HeaderMobile 컴포넌트
 * ----------------------
 * 모바일 화면에서만 보이는 상단 헤더.
 *
 * 1. 토큰 존재 시에만 (로그인 시에만) 햄버거 메뉴 버튼 활성화
 * 2. menuOpen 상태에 따라 메뉴 오버레이 표시
 * 3. 메뉴 항목 클릭 시 메뉴 닫기 및 페이지 이동
 * 4. adminRoleId === 0 (마스터 계정)일 경우 '계정 만들기' 메뉴 노출
 * 5. 로그아웃 버튼 클릭 시 adminLogoutApi 호출 후 로그인 페이지로 이동
 */
export default function HeaderMobile() {
  const { logout } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const { adminAccessToken, adminRoleId } = useAdminAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <>
      <HeaderWrapper>
        <Link href="/dashboard">
          <Logo src="/logo/shinhanfoundation.svg" alt="로고" />
        </Link>

        <HamburgerButton
          onClick={() => adminAccessToken && setMenuOpen(true)}
          disabled={!adminAccessToken}
          hidden={!adminAccessToken}
        >
          <HamburgerIcon src="/icons/threeline.svg" alt="메뉴" />
        </HamburgerButton>
      </HeaderWrapper>

      {menuOpen && (
        <Overlay>
          <CloseButton onClick={() => setMenuOpen(false)}>
            <IoClose size={28} />
          </CloseButton>
          <MenuList>
            {menuItems.map(({ label, path, Icon }) => (
              <MenuLink
                key={path}
                href={path}
                onClick={() => setMenuOpen(false)}
              >
                <IconWrapper>
                  <Icon />
                </IconWrapper>
                {label}
              </MenuLink>
            ))}

            {adminRoleId === 0 && (
              <MenuLink href="/signup">
                <IconWrapper>
                  <AddUserIcon />
                </IconWrapper>
                계정 만들기
              </MenuLink>
            )}

            <MenuLink href="/" onClick={handleLogout}>
              <IconWrapper>
                <LogoutIcon />
              </IconWrapper>
              로그아웃
            </MenuLink>
          </MenuList>
        </Overlay>
      )}
    </>
  );
}

type MenuItem = {
  label: string;
  path: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const menuItems: MenuItem[] = [
  { label: "대시보드", path: "/dashboard", Icon: DashboardIcon },
  { label: "예약관리", path: "/reservation", Icon: ReservationIcon },
  { label: "공간관리", path: "/space", Icon: SpaceIcon },
];

// --- styled ---
const HeaderWrapper = styled.header`
  width: 100%;
  height: var(--header-height);
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

const MenuLink = styled(Link)`
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

const IconWrapper = styled.span`
  display: flex;
  margin-right: 1rem;

  svg {
    width: 100%;
    height: 100%;
  }
`;
