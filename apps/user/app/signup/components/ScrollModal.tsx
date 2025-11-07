import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import Button from "@components/ui/button/Button";

interface ScrollModalProps {
  isOpen: boolean; // 모달 열림 상태
  onClose: () => void; // 모달 닫기 함수
  children: string; // HTML 문자열 형태의 내용 (약관, 상세 정보 등)
}

/**
 * ScrollModal 컴포넌트
 * ---------------------
 * 긴 내용(약관 등)을 스크롤하여 볼 수 있는 형태의 모달 컴포넌트.
 *
 * @remarks
 * - 내용(children)을 dangerouslySetInnerHTML을 사용해 HTML로 렌더링.
 * - 확인 버튼 클릭 시 모달이 닫힘.
 */
const ScrollModal = ({ isOpen, onClose, children }: ScrollModalProps) => {
  if (!isOpen) return null; // 닫혀 있으면 아무것도 렌더링하지 않음

  return (
    <Overlay>
      <ModalContainer>
        <Content dangerouslySetInnerHTML={{ __html: children }} />
        <ButtonWrapper>
          <Button onClick={onClose} isActive={true}>
            확인
          </Button>
        </ButtonWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default ScrollModal;

// --- styled ---
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* 반투명 배경 */
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 90%;
  max-width: 500px;
  height: 80vh; /* 뷰포트 높이에 비례하는 크기 */
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 내부 스크롤을 위해 컨테이너 자체는 숨김 */
`;

const Content = styled.div`
  flex: 1; /* 남은 공간 전체 사용 */
  padding: 24px;
  overflow-y: auto; /* 내용이 길면 세로 스크롤 허용 */
  font-size: 14px;
  color: ${colors.graycolor100};
  line-height: 1.6;
`;

const ButtonWrapper = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${colors.graycolor20};
  display: flex;
  justify-content: center; /* 버튼 중앙 정렬 */
`;
