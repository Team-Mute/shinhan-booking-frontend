"use client";

import React, { type ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // 현재 경로를 알기 위해 usePathname 임포트
import styled from "@emotion/styled";
import Link from "next/link";
import logoutIcon from "@user/svg-icons/logout.svg";
import vectorIcon from "@user/svg-icons/vector.svg";
import { getAccountApi } from "@user/lib/api/user";
import { logoutApi } from "@user/lib/api/userAuth";

interface MyPageLayoutProps {
  children: ReactNode;
}

export default function MySideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState("사용자");

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    const fetchUserInfo = async () => {
      try {
        const userInfo = await getAccountApi();
        if (userInfo && userInfo.userName) {
          setUserName(userInfo.userName);
        }
      } catch (error) {
        console.error("사용자 정보를 불러오는 데 실패했습니다:", error);
      }
    };

    fetchUserInfo();

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
      alert("로그아웃 되었습니다.");
      router.push("/login"); // 로그아웃 성공 시 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  //  모바일이면서 예약 페이지 경로일 경우, children(예약 페이지)만 렌더링하고 레이아웃은 렌더링하지 않음
  if (isMobile && pathname.startsWith("/mypage/reservations")) {
    return <></>;
  }

  return (
    <Wrapper>
      <Sidebar>
        <SidebarInner>
          <MenuContainer>
            <TopSection>
              <UserInfo>
                <PageTitle>마이페이지</PageTitle>
                <Greeting>
                  {userName}님,
                  <br />
                  안녕하세요.
                </Greeting>
              </UserInfo>

              <NavMenu>
                <MenuSection>
                  <MenuTitle>예약정보</MenuTitle>
                  <SubMenu>
                    <Link href="/mypage/reservations">
                      <SubMenuItem>
                        <span>공간예약 내역</span>
                        <VectorLogo />
                      </SubMenuItem>
                    </Link>
                  </SubMenu>
                </MenuSection>

                <Link href="/mypage/user">
                  <MenuLink>
                    <MenuTitle>회원정보 관리</MenuTitle>
                    <VectorLogo />
                  </MenuLink>
                </Link>
              </NavMenu>
            </TopSection>
          </MenuContainer>

          <LogoutButton onClick={handleLogout}>
            <StyledLogo />
            <span>로그아웃</span>
          </LogoutButton>
        </SidebarInner>
      </Sidebar>
    </Wrapper>
  );
}

// --- Styled Components ---

const VectorLogo = styled(vectorIcon)`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const Wrapper = styled.div`
  display: flex;
  font-family: "Pretendard", sans-serif;
  background-color: #ffffff;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 251px;
  padding: 60px;
  flex-shrink: 0;
  background-color: #ffffff;

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
    height: 100vh;
    box-sizing: border-box;
    background-color: #ffffff;
  }
`;

const SidebarInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 메뉴와 로그아웃 버튼을 양 끝으로 분리 */
  min-height: calc(100vh - 180px);
`;

// 메뉴 전체를 감싸는 컨테이너 추가
const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  font-weight: 600;
  font-size: 20px;
  color: #191f28;
  margin: 0;
`;

const Greeting = styled.p`
  font-weight: 500;
  font-size: 16px;
  color: #191f28;
  margin: 0;
  line-height: 1.25;
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 32px;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MenuTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #191f28;
`;

const SubMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SubMenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  color: #8c8f93;
  cursor: pointer;

  &:hover {
    color: #191f28;
  }
`;

const MenuLink = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  background: none;
  border: none;
  cursor: pointer;

  span {
    font-weight: 500;
    font-size: 16px;
    color: #191f28;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #fff;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledLogo = styled(logoutIcon)`
  color: black;
  width: 24px;
  height: 24px;
`;
