"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import styled from "@emotion/styled";
import colors from "@styles/theme";

import { useAdminAuthStore } from "apps/admin/store/adminAuthStore";
import { useLogout } from "@admin/lib/hooks/useLogout";

import {
  DashboardIcon,
  ReservationIcon,
  SpaceIcon,
  AddUserIcon,
  LogoutIcon,
} from "@admin/svg-icons";

/**
 * AdminSidebar 컴포넌트
 * ----------------------
 * 관리자 페이지 좌측 사이드바를 렌더링하며,
 * 메뉴 선택, 로그아웃 기능 제공.
 *
 * 기능 요약:
 * 1. menuItems : 각 메뉴 정보(label, routing path, 아이콘)
 * 2. adminRoleId : 관리자 권한에 따라 '계정 만들기 / 계정 관리' 메뉴 분기
 * 3. logout : 로그아웃 훅을 이용해 로그아웃 처리 후 로그인 페이지로 이동
 * 4. MenuButton : 메뉴 클릭 시 해당 페이지로 이동, 선택된 메뉴 하이라이트
 * 5. IconWrapper : SVG 아이콘 감싸기 및 선택 상태에 따라 스타일 적용
 * 6. Content : 실제 페이지 콘텐츠 영역
 *
 * @remarks
 * 1. 데스크탑 전용 사이드바이며, 모바일 화면에서는 숨김 처리.
 * 2. 선택된 메뉴와 호버 시 색상 변화를 적용.
 * 3. SVG 아이콘은 ReactComponent로 import되어, CSS hover/stroke 적용 가능.
 * @param children - 사이드바 오른쪽에 렌더링될 페이지 콘텐츠
 */
export default function AdminSidebar({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { adminRoleId } = useAdminAuthStore();
  const { logout } = useLogout();

  return (
    <Container>
      <Menu>
        <MenuList>
          {menuItems.map(({ key, label, path, Icon }) => {
            const selected = pathname === path;
            return (
              <MenuButton
                key={key}
                selected={selected}
                onClick={() => router.push(path)}
              >
                <IconWrapper selected={selected}>
                  <Icon />
                </IconWrapper>
                {label}
              </MenuButton>
            );
          })}
          {adminRoleId === 0 ? (
            <MenuButton onClick={() => router.push("/make-account")}>
              <IconWrapper>
                <AddUserIcon />
              </IconWrapper>
              계정 만들기
            </MenuButton>
          ) : (
            <MenuButton onClick={() => router.push("/manage-account")}>
              <IconWrapper>
                <AddUserIcon />
              </IconWrapper>
              계정 관리
            </MenuButton>
          )}
        </MenuList>
        <Logout>
          <MenuButton onClick={logout}>
            <IconWrapper>
              <LogoutIcon />
            </IconWrapper>
            로그아웃
          </MenuButton>
        </Logout>
      </Menu>
      <Content>{children}</Content>
    </Container>
  );
}

type MenuKey = "dashboard" | "reservation" | "space";

const menuItems: {
  key: MenuKey;
  label: string;
  path: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  {
    key: "dashboard",
    label: "대시보드",
    path: "/dashboard",
    Icon: DashboardIcon,
  },
  {
    key: "reservation",
    label: "예약 관리",
    path: "/reservation",
    Icon: ReservationIcon,
  },
  { key: "space", label: "공간 관리", path: "/space", Icon: SpaceIcon },
];

// --- styled ---
const Container = styled.div`
  display: flex;
  height: calc(100vh - var(--header-height));
  overflow: hidden;
`;

const Menu = styled.nav`
  box-sizing: border-box;
  width: 16.25rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${colors.graycolor10};
  padding: 1.5rem 1.25rem;

  @media (max-width: 768px) {
    display: none; // 모바일에서는 숨김
  }
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuButton = styled.button<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  width: 220px;
  height: 56px;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) =>
    props.selected ? colors.maincolor : colors.graycolor100};
  background-color: ${(props) =>
    props.selected ? colors.maincolor5 : "transparent"};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    color: ${colors.maincolor};
    background-color: ${colors.maincolor5};
    svg {
      stroke: ${colors.maincolor};
    }
  }
`;

const IconWrapper = styled.span<{ selected?: boolean }>`
  display: flex;
  margin-right: 1rem;
`;

const Logout = styled.div`
  margin-bottom: 1.25rem;
`;

const Content = styled.section`
  flex: 1;
  padding-top: 2rem;
  padding-left: 2.38rem;
  padding-right: 1.7rem;
  background-color: white;
  border-top: 1px solid ${colors.graycolor10};
  overflow-y: auto;
`;
