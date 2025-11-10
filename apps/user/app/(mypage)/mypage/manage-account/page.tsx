"use client";

import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { GapBox } from "@user/components/GapBox";
import { useManageAccount } from "./hooks/useManageAccount";
import MySideBar from "../components/sideBar";

/**
 * ManageAccountPage 컴포넌트
 * ----------------------------
 * 사용자 본인의 계정 정보 확인 페이지
 *
 * @description
 * - 이름, 관리지역, 관리권한, 이메일 정보 표시.
 * - 비밀번호 변경 버튼 제공.
 * - 상태 및 비즈니스 로직은 useManageAccount 훅에서 관리.
 */
export default function ManageAccountPage() {
  const { accountInfo, handleChangePassword } = useManageAccount();

  if (!accountInfo) return <div>계정 정보를 불러올 수 없습니다.</div>;

  return (
    <Container>
      <MySideBar />
      <Wrapper>
        <GapBox h="8rem" />
        <TitleWrapper>
          <h3>회원정보 관리</h3>
        </TitleWrapper>
        <ContentsWrapper>
          <InfoRow label="회사명" value={accountInfo.companyName} gap={1} />
          <InfoRow label="이름" value={accountInfo.userName} gap={1} />

          <InfoRow label="이메일" value={accountInfo.userEmail} gap={1} />
          <InfoRow
            label="비밀번호"
            action={
              <PasswordButton onClick={handleChangePassword}>
                변경하기
              </PasswordButton>
            }
          />
        </ContentsWrapper>
      </Wrapper>
    </Container>
  );
}

type InfoRowProps = {
  label: string;
  value?: string;
  action?: React.ReactNode;
  gap?: number;
};

const InfoRow = ({ label, value, action, gap = 0.5 }: InfoRowProps) => {
  return (
    <Row gap={gap}>
      <Key>{label}</Key>
      {value && <Value>{value}</Value>}
      {action && action}
    </Row>
  );
};

// --- styled ---
const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding-right: 81px;
  font-family: "Pretendard", sans-serif;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    padding: 20px;
    box-sizing: border-box;
    gap: 16px;
    z-index: 100;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;

  .h3 {
    font-weight: 600;
    font-size: 1.25rem;
  }
`;

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Row = styled.div<{ gap?: number }>`
  display: flex;
  align-items: center;
  margin-bottom: ${({ gap }) => (gap ? `${gap}rem` : 0)};
`;

const Key = styled.span`
  width: 120px;
  font-weight: 500;
  font-size: 16px;
`;

const Value = styled.span`
  flex: 1;
  color: ${colors.graycolor50};
  font-size: 16px;
`;
const PasswordButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${colors.graycolor50};
  text-decoration: underline;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    opacity: 0.8;
  }
`;
