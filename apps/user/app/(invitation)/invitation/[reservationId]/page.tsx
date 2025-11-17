"use client";

import React from "react";
import styled from "@emotion/styled";
import { useParams } from "next/navigation";
import { useInvitation } from "@user/app/(invitation)/invitation/[reservationId]/hooks/useInvitation";
import { formatReservationPeriod } from "@user/utils/invitationDateTime";

export default function InvitationPage() {
  const params = useParams();
  const reservationId = Number(params.reservationId);
  const { invitation, loading, error } = useInvitation(reservationId);

  const handleDownload = () => {
    if (invitation?.reservationAttachment?.[0]) {
      window.open(invitation.reservationAttachment[0], "_blank");
    }
  };

  if (loading)
    return <StatusContainer>초대장을 불러오는 중입니다...</StatusContainer>;
  if (error) return <StatusContainer error>오류: {error}</StatusContainer>;
  if (!invitation)
    return (
      <StatusContainer error>초대장 정보를 찾을 수 없습니다.</StatusContainer>
    );

  const dateTimeDisplay = formatReservationPeriod(
    invitation.reservationFrom,
    invitation.reservationTo
  );
  const addressParts = invitation.addressRoad.split(" - ");

  return (
    <Container>
      <Content>
        <Title>
          {invitation.userName}님으로부터
          <br />
          초대장이 도착했어요!
        </Title>
        <Subtitle>공간 사용전에 첨부파일을 다운로드해보세요</Subtitle>
        <MailIcon src="/icons/mail.svg" alt="메일 아이콘" />
        <InfoBox>
          <Purpose>{invitation.reservationPurpose}</Purpose>
          <SpaceName>{invitation.spaceName}</SpaceName>
          <DateTime>{dateTimeDisplay}</DateTime>
          <Address>{addressParts[0]}</Address>
          {addressParts[1] && <Address>{addressParts[1]}</Address>}
        </InfoBox>
      </Content>
      <Footer>
        <DownloadButton
          onClick={handleDownload}
          disabled={!invitation.reservationAttachment?.length}
        >
          {!invitation.reservationAttachment?.length
            ? "첨부파일이 없습니다"
            : "첨부파일 다운로드"}
        </DownloadButton>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 393px;
  min-height: 100vh;
  background: #ffffff;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  font-family: "Pretendard", sans-serif;
`;

const Content = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 24px;
  line-height: 1.3;
  color: #000000;
  margin: 0 0 16px;
`;

const Subtitle = styled.p`
  font-weight: 500;
  font-size: 14px;
  color: #8c8f93;
  margin: 0;
`;

const MailIcon = styled.img`
  width: 165px;
  height: 157px;
  margin: 32px 0;
`;

const InfoBox = styled.div`
  width: 100%;
  background: #f3f4f4;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Purpose = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #555555;
  margin: 0 0 4px;
`;

const SpaceName = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const DateTime = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin: 0;
  line-height: 1.4;
  white-space: pre-line;
`;

const Address = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #8c8f93;
  margin: 0;
  line-height: 1.4;
`;

const Footer = styled.footer`
  padding: 24px 20px 32px;
  background: #ffffff;
  flex-shrink: 0;
`;

const DownloadButton = styled.button`
  width: 100%;
  height: 46px;
  background: #0046ff;
  border-radius: 8px;
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    background: #babcbe;
    cursor: not-allowed;
  }
`;

const StatusContainer = styled.div<{ error?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: ${(props) => (props.error ? "red" : "inherit")};
`;
