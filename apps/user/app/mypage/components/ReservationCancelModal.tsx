"use client";

import React from 'react';
import styled from '@emotion/styled';

interface ReservationCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ReservationCancelModal({ isOpen, onClose, onConfirm }: ReservationCancelModalProps) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Content>
          <Title>예약을 취소하시겠습니까?</Title>
          <Description>예약을 취소하면 더 이상 해당 예약은 변경이 불가능해요</Description>
        </Content>
        <ButtonContainer>
          <SecondaryButton onClick={onClose}>뒤로 돌아가기</SecondaryButton>
          <PrimaryButton onClick={onConfirm}>취소하기</PrimaryButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6); display: flex;
  justify-content: center; align-items: center; z-index: 1002; // 정보 모달보다 위에 표시
`;
const ModalContainer = styled.div`
  display: flex; flex-direction: column; align-items: center;
  padding: 32px 20px; gap: 24px;
  width: 353px; background: #FFFFFF; border-radius: 12px;
`;
const Content = styled.div`
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; text-align: center;
`;
const Title = styled.h1`
  font-size: 18px; font-weight: 600; color: #191F28; margin: 0;
  line-height: 145%;
`;
const Description = styled.p`
  font-size: 14px; font-weight: 500; color: #8C8F93; margin: 0;
  line-height: 145%; white-space: pre-line;
`;
const ButtonContainer = styled.div`
  display: flex; gap: 12px; width: 100%;
`;
const BaseButton = styled.button`
  display: flex; justify-content: center; align-items: center;
  width: 100%; height: 46px; border-radius: 8px;
  font-size: 14px; font-weight: 500; border: none; cursor: pointer;
  flex: 1;
`;
const SecondaryButton = styled(BaseButton)`
  background: #F2F6FF; color: #0046FF;
`;
const PrimaryButton = styled(BaseButton)`
  background: #0046FF; color: #FFFFFF;
`;