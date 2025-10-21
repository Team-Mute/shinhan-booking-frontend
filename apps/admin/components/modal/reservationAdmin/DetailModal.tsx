import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { IoCloseOutline } from "react-icons/io5";
import Button from "@components/ui/button/Button";
import { ReservationDetail } from "@admin/types/reservationAdmin";
import { getReservationDetailApi } from "@admin/lib/api/adminReservation";
import { useModalStore } from "@admin/store/modalStore";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: number | null;
  onApproveClick: (id: number) => void;
  onRejectClick: (id: number) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  reservationId,
  onApproveClick,
  onRejectClick,
}) => {
  const [reservation, setReservation] = useState<ReservationDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { open } = useModalStore();

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (!reservationId) {
        setReservation(null);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getReservationDetailApi(reservationId);
        setReservation(data);
      } catch (err) {
        // 에러 발생 시 reservation을 null로 유지
        console.error("Failed to fetch reservation details", err);
        setReservation(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchReservationDetails();
    }
  }, [isOpen, reservationId]);

  // -------------------- 렌더링 로직 시작 --------------------
  if (!isOpen) return null;

  // 1. 로딩 중인 경우
  if (isLoading) {
    return (
      <Overlay>
        <ModalContainer>
          <div>로딩 중...</div>
        </ModalContainer>
      </Overlay>
    );
  }

  // 2. API 호출 실패 또는 데이터가 없는 경우
  if (!reservation) {
    open(
      "오류 발생",
      "예약 상세 정보를 불러오지 못했거나 정보를 찾을 수 없습니다.",
      onClose
    );

    return null;
  }

  // 3. 모든 데이터가 유효한 경우, 실제 모달 내용 렌더링
  const isPending =
    reservation.reservationStatusName === "1차 승인 대기" ||
    reservation.reservationStatusName === "2차 승인 대기";
  const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return ["", "", ""];
    const parts = phoneNumber.split("-");
    if (parts.length === 3) return parts;
    if (phoneNumber.length === 11) {
      return [
        phoneNumber.substring(0, 3),
        phoneNumber.substring(3, 7),
        phoneNumber.substring(7, 11),
      ];
    }
    return [phoneNumber];
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>상세보기</ModalTitle>
          <CloseButton onClick={onClose}>
            <IoCloseOutline size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <DetailSection>
            <InfoRow>
              <InfoLabel>예약 공간</InfoLabel>
              <InputField>{reservation?.spaceName}</InputField>
            </InfoRow>
            <InfoRow>
              <InfoLabel>예약자명</InfoLabel>
              <InputField>{reservation.user.name}</InputField>
            </InfoRow>
            <InfoRow>
              <InfoLabel>회사명</InfoLabel>
              <InputField>{reservation.user.company}</InputField>
            </InfoRow>
            <InfoRow>
              <InfoLabel>사용 목적</InfoLabel>
              <InputField>{reservation.reservationPurpose}</InputField>
            </InfoRow>
            <InfoRow>
              <InfoLabel>예약자 이메일</InfoLabel>
              <InputField>{reservation.user.email}</InputField>
            </InfoRow>
            <InfoRow>
              <InfoLabel>예약 번호</InfoLabel>
              <InputField>{reservation.orderId}</InputField>
            </InfoRow>
          </DetailSection>
        </ModalBody>
        <ModalFooter>
          {isPending && reservationId && (
            <>
              <ApproveButton
                //disabled={!reservation.isApprovable}
                onClick={() => {
                  onApproveClick(reservationId);
                  onClose(); 
                }}
                width="48%"
                isActive={reservation.isApprovable}
              >
                승인하기
              </ApproveButton>
              <RejectButton
                //disabled={!reservation.isRejectable}
                onClick={() => { 
                  onRejectClick(reservationId);
                  onClose(); 
                }}
                width="48%"
                isActive={reservation.isRejectable}
              >
                반려하기
              </RejectButton>
            </>
          )}
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

export default DetailModal;

//styled components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 900;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
`;

const ModalContainer = styled.div`
  width: 25.5rem; /* 이미지에 맞게 너비 조정 */
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1.5rem;
  margin: 1rem; /* 모바일 뷰포트 고려 */
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0; /* 헤더 하단 패딩 제거 */
  margin-bottom: 1.5rem; /* 헤더와 본문 사이 간격 조정 */
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  flex-grow: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #6b7280;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 각 섹션(예약정보, 신청자정보 등) 간 간격 */
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 각 정보 항목(label-input 쌍) 간 간격 */
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column; /* 라벨과 인풋이 세로로 정렬되도록 */
  gap: 0.5rem; /* 라벨과 인풋 사이 간격 */
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #333; /* 라벨 색상 조정 */
`;

const InputField = styled.div`
  width: 100%;
  min-height: 2.5rem; /* 입력 필드의 최소 높이 */
  padding: 0.625rem 0.75rem; /* 내부 패딩 */
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #f9fafb; /* 배경색 */
  color: #333;
  font-size: 0.875rem;
  display: flex; /* 내부 텍스트 정렬을 위해 flex 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  word-break: break-all; /* 긴 텍스트 줄바꿈 */
  white-space: pre-wrap; /* 사용 목적처럼 여러 줄 입력 처리 */
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between; /* 버튼들을 양 끝으로 정렬 */
  margin-top: 2rem; /* 푸터와 본문 사이 간격 조정 */
  gap: 1rem; /* 버튼 간 간격 */
`;

// 이미지에 있는 버튼 스타일을 반영한 버튼 컴포넌트
const ApproveButton = styled(Button)`
  background-color: #e6efff; /* 배경색 */
  color: #0046ff; /* 글자색 */
  &:hover:not(:disabled) {
    background-color: #d0e0ff; /* 호버 시 배경색 */
  }
  cursor: pointer;
`;

const RejectButton = styled(Button)`
  background-color: #fff2f2; /* 배경색 */
  color: #ff0000; /* 글자색 */
  &:hover:not(:disabled) {
    background-color: #ffe0e0; /* 호버 시 배경색 */
  }
  cursor: pointer;
`;

const TwoButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
`;
