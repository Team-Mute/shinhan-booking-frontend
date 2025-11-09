"use client";

import React, { type ReactNode, useState, useEffect } from "react";
import styled from "@emotion/styled";

import logoutIcon from "@user/svg-icons/logout.svg";
import MySideBar from "./components/sideBar";

const ChevronRightIcon = styled(() => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="#191F28"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
))`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

interface MyPageLayoutProps {
  children: ReactNode;
}

export default function MyPageLayout() {
  return <MySideBar />;
}

// --- Styled Components ---

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
  height: 100vh;
  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    height: 100vh;
    background-color: #ffffff;
  }
`;

const SidebarInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 메뉴와 로그아웃 버튼을 양 끝으로 분리 */
  min-height: calc(100vh - 120px);

  @media (max-width: 768px) {
    min-height: auto;
  }
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
