"use client";

import React from "react";
import Calendar from "@components/Calendar";
import {
  ModalContainer,
  Overlay,
  Header,
  CloseButton,
  Footer,
} from "./SpaceFormModal/styles";
import { IoCloseOutline } from "react-icons/io5";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import Button from "@components/ui/button/Button";
import { GapBox } from "@admin/components/GapBox";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (start: string, end?: string) => void;
}

const CalendarModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer
        role="dialog"
        aria-modal="true"
        aria-labelledby="sfm-title"
      >
        <Header>
          <h2 id="sfm-title">하루 또는 기간 선택</h2>
          <CloseButton onClick={onClose} aria-label="닫기">
            <IoCloseOutline size={26} />
          </CloseButton>
        </Header>
        <Calendar onSelectDate={(result) => console.log(result)} />

        <InfoWrapper>
          <InfoBox>
            <Info color={colors.graycolor20}>
              <div></div>
              <p>오늘</p>
            </Info>
            <Info color={colors.maincolor}>
              <div></div>
              <p>선택</p>
            </Info>
          </InfoBox>
        </InfoWrapper>
        <GapBox h="1.94rem" />
        <Footer>
          <Button onClick={() => {}} isActive={true}>
            휴무일로 등록하기
          </Button>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default CalendarModal;

// --- styled ---
const InfoWrapper = styled.div`
  margin-top: 0.75rem;
  height: 2.625rem;

  display: flex;
  justify-content: center;
`;

const InfoBox = styled.div`
  display: flex; /* Info들을 가로 배치 */
  gap: 1rem; /* Info끼리 간격 */
  border-top: 1px solid ${colors.graycolor5};
  width: 22.9rem;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
`;

const Info = styled.div<{ color: string }>`
  display: flex; /* 동그라미 + 텍스트 가로 배치 */
  align-items: center;
  gap: 0.22rem; /* 동그라미와 글자 간격 */

  div {
    width: 0.68rem;
    height: 0.68rem;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    flex-shrink: 0;
  }

  p {
    font-size: 0.875rem;
    color: ${colors.graycolor100};
  }
`;
