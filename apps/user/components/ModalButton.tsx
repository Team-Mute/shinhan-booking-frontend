"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import breakpoints, { media } from "@styles/breakpoints";
import colors from "@styles/theme";

interface ModalButtonProps {
  label: string; // 버튼에 표시될 텍스트
  modal: React.ReactNode; // 드롭다운/모바일 오버레이 내부에 렌더링할 모달 콘텐츠
  isOpen: boolean; // 모달 열림 상태
  onToggle: () => void; // 모달 상태 토글 함수
}

/**
 * ModalButton 컴포넌트
 * -----------------------
 * 클릭 시 드롭다운 또는 모바일 전체 화면 오버레이 모달을 토글하는 버튼.
 *
 * @remarks
 * - PC: 버튼 바로 아래에 드롭다운 형태로 모달 표시 (Portal 사용).
 * - Mobile: 전체 화면을 덮는 오버레이 형태로 모달 표시 (Portal 사용).
 * - 모달 콘텐츠에 isMobile prop을 자동으로 주입.
 */
export default function ModalButton({
  label,
  modal,
  isOpen,
  onToggle,
}: ModalButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null); // 버튼 위치 측정을 위한 DOM 참조
  const [isMobile, setIsMobile] = useState(false); // 현재 모바일 환경인지 여부
  const [modalPos, setModalPos] = useState({ top: 0, left: 0 }); // 데스크탑 드롭다운 위치

  // 화면 크기 감지 (모바일 여부 판단)
  useEffect(() => {
    // CSS media query를 이용해 모바일 분기점 감지
    const mq = window.matchMedia(`(max-width: ${breakpoints.mobile})`);
    const update = () => setIsMobile(mq.matches);
    update(); // 초기 값 설정
    mq.addEventListener("change", update); // 변경 시 리스너 등록
    return () => mq.removeEventListener("change", update); // 클린업
  }, []);

  // 버튼 위치 계산 (데스크탑 모드에서만)
  useEffect(() => {
    // 버튼 참조가 있고, 모바일이 아니고, 모달이 열렸을 때만 위치 계산
    if (!buttonRef.current || isMobile || !isOpen) return;
    const rect = buttonRef.current.getBoundingClientRect(); // 뷰포트 기준 버튼 위치
    setModalPos({
      top: rect.bottom + window.scrollY + 8, // 버튼 하단 + 스크롤 위치 + 간격 8px
      left: rect.left + window.scrollX, // 버튼 좌측 위치
    });
  }, [isOpen, isMobile]);

  /**
   * @description 모달 렌더링 함수 (Portal 사용)
   */
  const renderModal = () => {
    if (!isOpen) return null;

    // 모달 컴포넌트에 isMobile prop을 주입
    const modalWithProps = React.isValidElement(modal)
      ? React.cloneElement(modal as React.ReactElement<any, any>, { isMobile })
      : modal;

    // document.body에 렌더링
    return createPortal(
      isMobile ? (
        // 모바일: 전체 화면 오버레이
        <MobileOverlay>{modalWithProps}</MobileOverlay>
      ) : (
        // 데스크탑: 계산된 위치에 드롭다운
        <DesktopDropdown style={{ top: modalPos.top, left: modalPos.left }}>
          {modalWithProps}
        </DesktopDropdown>
      ),
      document.body
    );
  };

  return (
    <Wrapper ref={buttonRef}>
      <Button onClick={onToggle}>
        <LabelSpan>{label}</LabelSpan>
        {/* 모달 상태에 따라 화살표 아이콘 변경 */}
        <img src={`/icons/arrow-${isOpen ? "up" : "down"}.svg`} alt="arrow" />
      </Button>
      {renderModal()}
    </Wrapper>
  );
}

// --- styled ---
const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.62rem 1rem;
  border-radius: 1.875rem;
  background-color: ${colors.graycolor5};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
`;

const LabelSpan = styled.span`
  white-space: nowrap; // 줄바꿈 방지
  writing-mode: horizontal-tb; // 텍스트 방향을 명시적으로 가로(기본값)로 설정
`;

const DesktopDropdown = styled.div`
  position: absolute;
  z-index: 1000;
`;

const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  ${media.mobileUp} {
    display: none;
  }
`;
