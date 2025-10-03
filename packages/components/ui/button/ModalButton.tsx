/** @jsxImportSource @emotion/react */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import ArrowDown from "@styles/icons/arrow-down.svg";
import ArrowUp from "@styles/icons/arrow-up.svg";

interface ModalButtonProps {
  label: string;
  modal?: React.ReactNode;
  isOpen: boolean; // 부모에서 내려주는 열림 상태
  onToggle: () => void; // 버튼 클릭 시 실행 (열기/닫기 토글)
}

export default function ModalButton({
  label,
  modal,
  isOpen,
  onToggle,
}: ModalButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  // 버튼 위치 계산 (모달 위치 조정)
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.bottom + 16,
        left: rect.left,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    function updatePosition() {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setModalPosition({
          top: rect.bottom + window.scrollY + 8, // 뷰포트 기준 좌표 + 스크롤값
          left: rect.left + window.scrollX,
        });
      }
    }

    updatePosition();

    // 스크롤/리사이즈 될 때도 위치 업데이트
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  return (
    <Wrapper ref={buttonRef}>
      <Button onClick={onToggle}>
        <span>{label}</span>
        {isOpen ? <ArrowUp /> : <ArrowDown />}
      </Button>
      {isOpen &&
        modal &&
        createPortal(
          <ModalWrapper
            style={{ top: modalPosition.top, left: modalPosition.left }}
          >
            {modal}
          </ModalWrapper>,
          document.body
        )}
    </Wrapper>
  );
}

// --- styled ---
const Wrapper = styled.div`
  position: relative; /* 모달 위치 계산용 */
  display: inline-block;
  // min-width: 5.18rem;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.62rem 1rem;
  border-radius: 1.875rem;
  background-color: ${colors.graycolor5};

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 0.9625rem */

  cursor: pointer;
  user-select: none;

  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
`;

const ModalWrapper = styled.div`
  position: absolute;
  z-index: 1000;
`;
