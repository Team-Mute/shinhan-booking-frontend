"use client";

import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import Button from "@components/ui/button/Button";
import { IoCloseOutline } from "react-icons/io5";

interface DropdownModalProps {
  title: string; // 모달 헤더에 표시할 제목
  onClose: () => void; // 닫기 버튼 클릭 시 호출될 함수
  children: React.ReactNode; // 모달 내용
  onApply?: () => void; // '적용하기' 버튼 클릭 시 호출될 함수 (선택 사항)
  applyLabel?: string; // '적용하기' 버튼 라벨
  isApplyActive?: boolean; // '적용하기' 버튼 활성화 상태
  isMobile?: boolean; // ModalButton으로부터 주입받는 모바일 여부 상태 (스타일링 분기용)
}

/**
 * DropdownModal 컴포넌트
 * -----------------------
 * ModalButton 내부에 렌더링되어 사용되는 드롭다운 또는 모바일 오버레이 콘텐츠 모달.
 *
 * @remarks
 * - 데스크탑에서는 드롭다운 스타일, 모바일에서는 전체 화면 스타일 적용.
 * - 선택적으로 하단에 '적용하기' 버튼을 가질 수 있음.
 */
export default function DropdownModal({
  title,
  onClose,
  children,
  onApply,
  applyLabel = "적용하기",
  isApplyActive = false,
  isMobile = false, // ModalButton에서 props로 받음
}: DropdownModalProps) {
  return (
    <Container isMobile={isMobile}>
      {/* 모달 헤더 (제목 및 닫기 버튼) */}
      <Header>
        <Title>{title}</Title>
        <CloseButton onClick={onClose}>
          <IoCloseOutline size={24} />
        </CloseButton>
      </Header>

      {/* 모달 콘텐츠 영역 */}
      <Content>{children}</Content>

      {/* '적용하기' 버튼 영역 (onApply 함수가 있을 때만 렌더링) */}
      {onApply && (
        <Footer>
          <Button
            onClick={onApply}
            isActive={isApplyActive}
            width="100%"
            disabled={!isApplyActive} // 비활성 상태면 클릭 불가능
          >
            {applyLabel}
          </Button>
        </Footer>
      )}
    </Container>
  );
}

// --- styled ---
const Container = styled.div<{ isMobile: boolean }>`
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 22rem;
  border: ${({ isMobile }) =>
    isMobile ? "none" : `1px solid ${colors.graycolor10}`};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid ${colors.graycolor10};
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 1.125rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Content = styled.div`
  padding: 1rem 1.25rem;
  flex: 1;
`;

const Footer = styled.div`
  padding: 1.25rem;
  border-top: 1px solid ${colors.graycolor10};
`;
