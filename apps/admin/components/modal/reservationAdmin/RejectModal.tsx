import React from "react";
import styled from "@emotion/styled";
import { IoCloseOutline } from "react-icons/io5";
import Button from "@components/ui/button/Button";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  rejectionReason,
  setRejectionReason,
}) => {
  if (!isOpen) return null;

  const isReasonEmpty = rejectionReason.trim().length === 0;
  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>반려 사유 작성</ModalTitle>
          <CloseButton onClick={onClose}>
            <IoCloseOutline size={24} color="#6b7280" />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <Textarea
            placeholder="반려 사유를 입력해주세요"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onConfirm}
            disabled={isReasonEmpty}
            isActive={!isReasonEmpty}
            width="100%"
          >
            반려하기
          </Button>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

export default RejectModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 1.125rem;
  color: #191f28;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
`;

const Textarea = styled.textarea`
  /* 기존 스타일 제거 또는 주석 처리 */
  /* width: 100%;
  min-height: 120px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  resize: vertical;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  } */

  /* 새롭게 적용할 스타일 */
  width: 100%;
  min-height: 140px; /* 이미지처럼 더 높게 설정 */
  padding: 16px; /* 패딩 조정 */
  border-radius: 12px; /* 모서리 더 둥글게 */
  border: none; /* 테두리 제거 */
  background-color: #f3f4f4; /* 배경색 설정 (이미지 배경과 유사하게) */
  font-family: "Pretendard"; /* 폰트 적용 */
  font-size: 14px; /* 글꼴 크기 */
  font-weight: 400; /* 글꼴 두께 */
  line-height: 20px; /* 줄 높이 */
  letter-spacing: -0.011em; /* 자간 */
  color: #191f28; /* 글자색 */
  resize: none; /* 크기 조절 비활성화 (이미지상으로는 고정된 크기) */

  &::placeholder {
    color: #8c8f93; /* 플레이스홀더 색상 (이미지 참고) */
  }

  &:focus {
    outline: none; /* 포커스 시 아웃라인 제거 */
    /* 필요하다면 포커스 시 배경색 변경 등의 스타일 추가 가능 */
    /* background-color: #e0e0e0; */
  }
`;
