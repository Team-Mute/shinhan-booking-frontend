"use client";

import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { Button } from "@components";
import { useModalStore } from "@admin/store/modalStore";

const InfoModal = () => {
  const { isOpen, title, subtitle, close } = useModalStore();

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <TitleWrapper>
          <Title>{title}</Title>
        </TitleWrapper>
        <SubtitleWrapper>
          <SubTitle>{subtitle}</SubTitle>
        </SubtitleWrapper>

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
