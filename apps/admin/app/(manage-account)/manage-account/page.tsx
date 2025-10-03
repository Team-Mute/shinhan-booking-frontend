"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import colors from "@styles/theme";
import { GapBox } from "@admin/components/GapBox";
import { getAdminAccountApi } from "@admin/lib/api/admin";
import { AdminAccount } from "@admin/types/dto/admin.dto";
export default function ManageAccountPage() {
  const [accountInfo, setAccountInfo] = useState<AdminAccount | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const { data } = await getAdminAccountApi();
        setAccountInfo(data);
      } catch (err) {
        console.error("계정 정보 불러오기 실패:", err);
      }
    };
    fetchAccount();
  }, []);

  const handleChangePassword = () => {
    router.push("/change-password");
    console.log("비밀번호 변경 클릭");
  };

  const mapRoleId = (roleId: number) => {
    switch (roleId) {
      case 0:
        return "마스터 계정";
      case 1:
        return "2차 관리자";
      case 2:
        return "1차 관리자";
      default:
        return "알 수 없음";
    }
  };

  if (!accountInfo) return <div>계정 정보를 불러올 수 없습니다.</div>;

  return (
    <Container>
      <TitleWrapper>
        <h1>계정 관리</h1>
      </TitleWrapper>
      <GapBox h="2rem"></GapBox>
      <ContentsWrapper>
        <InfoRow label="이름" value={accountInfo.userName} gap={1} />
        <InfoRow label="관리지역" value={accountInfo.regionName} gap={0.5} />
        <InfoRow
          label="관리권한"
          value={mapRoleId(accountInfo.roleId)}
          gap={1}
        />
        <InfoRow label="이메일" value={accountInfo.userEmail} gap={0.5} />
        <InfoRow
          label="비밀번호"
          action={
            <PasswordButton onClick={handleChangePassword}>
              변경하기
            </PasswordButton>
          }
        />
      </ContentsWrapper>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  //   background-color: beige;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-bottom: 1rem;

  .h1 {
    font-weight: 600;
    font-size: 1.5rem;
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
