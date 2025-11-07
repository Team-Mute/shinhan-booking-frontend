"use client";

import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { Button } from "@components";
import { useModalStore } from "@user/store/modalStore";

/**
 * InfoModal 컴포넌트
 * -------------------
 * useModalStore를 통해 전역적으로 제어되는 일반적인 알림/정보 모달 컴포넌트.
 *
 * @remarks
 * - 모달 내용(title, subtitle)은 전역 스토어 상태에 의해 결정됨.
 * - '확인' 버튼 클릭 시 스토어의 close 함수가 호출되어 모달을 닫고,
 * 등록된 onClose 콜백(있는 경우)을 실행함.
 */
const InfoModal = () => {
  // 스토어에서 상태와 닫기 함수 가져오기
  const { isOpen, title, subtitle, close } = useModalStore();

  if (!isOpen) return null; // 모달이 닫혀 있으면 렌더링하지 않음

  return (
    <Overlay>
      <ModalContainer>
        {/* 제목 표시 */}
        <TitleWrapper>
          <Title>{title}</Title>
        </TitleWrapper>
        {/* 내용/부제목 표시 */}
        <SubtitleWrapper>
          <SubTitle>{subtitle}</SubTitle>
        </SubtitleWrapper>

        {/* 확인 버튼 */}
        <ButtonWrapper>
          <Button onClick={close} isActive={true} width={"50%"}>
            확인
          </Button>
        </ButtonWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default InfoModal;

// --- styled ---
const maxWidth = "22rem";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: ${maxWidth};
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 2.25rem 3.25rem;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 145%;
  letter-spacing: -0.01238rem;
`;

const SubtitleWrapper = styled.div`
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
  width: 100%;
  box-sizing: border-box;
`;

const SubTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.00963rem;
  color: ${colors.graycolor50};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  width: 100%;
`;
