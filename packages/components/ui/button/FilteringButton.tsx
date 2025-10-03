"use client";

import React from "react";
import styled from "@emotion/styled";
import colors from "../../../styles/theme";

interface FilteringButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void; // 부모에서 열기 상태 제어
}

export default function FilteringButton({
  label,
  icon,

  onClick,
}: FilteringButtonProps) {
  return (
    <Wrapper>
      <Button onClick={onClick}>
        {icon && <IconWrapper>{icon}</IconWrapper>}

        <span>{label}</span>
      </Button>
    </Wrapper>
  );
}

// --- styled ---
const Wrapper = styled.div`
  position: relative; /* 모달 위치 계산용 */
  display: inline-block;
  min-width: 5.9rem;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.62rem 1rem;
  border-radius: 1.875rem;
  background-color: ${colors.maincolor5};

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 0.9625rem */

  cursor: pointer;
  user-select: none;
`;

const ModalWrapper = styled.div`
  position: absolute;
  z-index: 1000;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;
