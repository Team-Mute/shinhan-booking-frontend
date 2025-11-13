import React from "react";
import styled from "@emotion/styled";
import { Button } from "@components/index";
import colors from "@styles/theme";

interface ReservationSuccessModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ReservationSuccessModal = ({
  isOpen,
  title,
  subtitle,
  onConfirm,
  onCancel,
}: ReservationSuccessModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Overlay>
      <ModalContainer>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
        <ButtonContainer>
          <Button width="100%" isActive={true} onClick={onConfirm}>
            내 예약 확인하기
          </Button>
          <Button width="100%" isActive={false} onClick={onCancel}>
            홈으로 가기
          </Button>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default ReservationSuccessModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 24px;
  gap: 16px;
  width: 353px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.graycolor100};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${colors.graycolor50};
  text-align: center;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;
