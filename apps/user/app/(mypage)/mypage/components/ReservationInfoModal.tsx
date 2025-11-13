"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  getReservationApi,
  getReservationRejectMsgApi,
  cancleReservationApi,
} from "@user/lib/api/reservation";
import ReservationCancelModal from "./ReservationCancelModal";
import ReservationChangeModal from "./ReservationChangeModal";

// --- 타입 정의 ---
interface Previsit {
  previsitId: number;
  previsitFrom: string;
  previsitTo: string;
}
interface ReservationDetails {
  spaceName: string;
  spaceImageUrl: string | null;
  orderId: string;
  reservationFrom: string;
  reservationTo: string;
  reservationHeadcount: number;
  reservationPurpose: string;
  reservationStatusName:
    | "진행중"
    | "예약완료"
    | "이용완료"
    | "예약취소"
    | "반려";
  previsits: Previsit[];
  reservationAttachment?: string[];
}
interface ReservationInfoModalProps {
  isOpen: boolean;
  onClose: (isChanged?: boolean) => void; // 변경 여부를 전달할 수 있도록 수정
  reservationId: number | null;
  status: string;
}

// --- 유틸리티 함수 ---
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return {
    date: `${year}년 ${month}월 ${day}일, ${dayOfWeek}요일`,
    time: `${hours}:${minutes}`,
  };
};
const calculateDuration = (from: string, to: string) => {
  const durationMs = new Date(to).getTime() - new Date(from).getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  return hours > 0 ? `, ${hours}시간` : "";
};
const getFileNameFromUrl = (url: string) => {
  try {
    return decodeURIComponent(url.split("/").pop() || "");
  } catch (e) {
    return url.split("/").pop() || "";
  }
};

// --- 컴포넌트 ---
export default function ReservationInfoModal({
  isOpen,
  onClose,
  reservationId,
  status,
}: ReservationInfoModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "reason">("info");
  const [reservation, setReservation] = useState<ReservationDetails | null>(
    null
  );
  const [rejectMessage, setRejectMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // 취소 확인 모달 상태
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  const isRejected = reservation?.reservationStatusName === "반려";

  useEffect(() => {
    if (!isOpen || !reservationId) {
      setReservation(null);
      setActiveTab("info");
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resData = await getReservationApi(reservationId);
        const result = resData.reservationStatusName
          ? resData
          : { ...resData, reservationStatusName: status };
        setReservation(result);
        if (result.reservationStatusName === "반려") {
          try {
            const rejectData = await getReservationRejectMsgApi(reservationId);
            setRejectMessage(
              rejectData.memo || "반려 사유를 불러왔으나 내용이 없습니다."
            );
          } catch (err) {
            if ((err as any).response?.status === 404) {
              setRejectMessage("등록된 반려 사유가 없습니다.");
            } else {
              console.error("반려 사유를 가져오는 데 실패했습니다:", err);
              setRejectMessage("반려 사유를 불러오는 중 오류가 발생했습니다.");
            }
          }
        }
      } catch (error) {
        console.error("예약 상세 정보를 가져오는 데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isOpen, reservationId, status]);

  const handleConfirmCancel = async () => {
    if (!reservationId) return;
    try {
      await cancleReservationApi(reservationId);
      alert("예약이 성공적으로 취소되었습니다.");
      setIsCancelModalOpen(false);
      onClose(true); // 변경되었음을 알림
    } catch (error) {
      console.error("예약 취소 실패:", error);
      alert("예약 취소에 실패했습니다.");
    }
  };

  const handleOpenChangeModal = () => {
    setIsChangeModalOpen(true); // 변경 모달 열기
  };

  if (!isOpen) return null;

  // ... (renderInfoContent 함수 동일)
  const renderInfoContent = () => {
    if (isLoading) return <LoadingState>로딩 중...</LoadingState>;
    if (!reservation)
      return <LoadingState>예약 정보를 불러올 수 없습니다.</LoadingState>;

    const from = formatDateTime(reservation.reservationFrom);
    const to = formatDateTime(reservation.reservationTo);
    const duration = calculateDuration(
      reservation.reservationFrom,
      reservation.reservationTo
    );
    const previsit =
      reservation.previsits?.length > 0
        ? formatDateTime(reservation.previsits[0].previsitFrom)
        : null;

    return (
      <InfoSection>
        <DetailItem>
          <DetailLabel>이용공간</DetailLabel>
          {reservation.spaceImageUrl && (
            <SpaceImage
              src={reservation.spaceImageUrl}
              alt={reservation.spaceName}
            />
          )}
          <DetailValue>{reservation.spaceName}</DetailValue>
        </DetailItem>
        <InfoRow label="예약번호" value={reservation.orderId} />
        <InfoRow label="이용날짜" value={from.date} />
        <InfoRow
          label="이용시간"
          value={`${from.time}~${to.time}${duration}`}
        />
        <InfoRow
          label="이용인원"
          value={`${reservation.reservationHeadcount}명`}
        />
        <InfoRow label="사용 목적" value={reservation.reservationPurpose} />
        {previsit && (
          <InfoRow
            label="사전 답사 예약시간"
            value={`${previsit.date} ${previsit.time}`}
          />
        )}
        {reservation.reservationAttachment &&
          reservation.reservationAttachment.length > 0 && (
            <DetailItem>
              <DetailLabel>첨부파일</DetailLabel>
              {reservation.reservationAttachment.map((url) => (
                <FileItem key={url}>
                  <FileName>{getFileNameFromUrl(url)}</FileName>
                  <FileDeleteButton>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18 6L6 18" stroke="#191F28" strokeWidth="1.5" />
                      <path d="M6 6L18 18" stroke="#191F28" strokeWidth="1.5" />
                    </svg>
                  </FileDeleteButton>
                </FileItem>
              ))}
            </DetailItem>
          )}
      </InfoSection>
    );
  };

  const renderFooterButtons = () => {
    if (!reservation) return null;
    switch (reservation.reservationStatusName) {
      case "진행중":
      case "예약완료":
        return (
          <PrimaryButton onClick={() => setIsCancelModalOpen(true)}>
            예약취소
          </PrimaryButton>
        );
      case "반려":
        return (
          <>
            <ActionButton onClick={() => setIsCancelModalOpen(true)}>
              예약취소
            </ActionButton>
            <PrimaryButton onClick={handleOpenChangeModal}>
              예약 변경하기
            </PrimaryButton>
          </>
        );
      case "예약취소":
        return (
          <PrimaryButton onClick={handleOpenChangeModal}>
            다시 예약하기
          </PrimaryButton>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ModalOverlay
        onClick={() => onClose()}
        style={{ display: isOpen ? "flex" : "none" }}
      >
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>상세보기</ModalTitle>
            <CloseButton onClick={() => onClose()}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 6L6 18" stroke="#191F28" strokeWidth="1.5" />
                <path d="M6 6L18 18" stroke="#191F28" strokeWidth="1.5" />
              </svg>
            </CloseButton>
          </ModalHeader>
          <ModalContent>
            <TabContainer>
              <TabButton
                isActive={activeTab === "info"}
                onClick={() => setActiveTab("info")}
              >
                예약 정보
              </TabButton>
              {isRejected && (
                <TabButton
                  isActive={activeTab === "reason"}
                  onClick={() => setActiveTab("reason")}
                >
                  반려사유
                </TabButton>
              )}
            </TabContainer>
            {activeTab === "info" ? (
              renderInfoContent()
            ) : (
              <RejectReasonContent>{rejectMessage}</RejectReasonContent>
            )}
          </ModalContent>
          <ModalFooter hasButtons={!!renderFooterButtons()}>
            {renderFooterButtons()}
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
      <ReservationCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
      <ReservationChangeModal
        isOpen={isChangeModalOpen}
        onClose={(isChanged) => {
          setIsChangeModalOpen(false);
          if (isChanged) {
            onClose(true);
          }
        }}
        reservationData={reservation}
      />
    </>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <DetailItem>
    <DetailLabel>{label}</DetailLabel>
    <DetailValue>{value}</DetailValue>
  </DetailItem>
);

// --- 스타일 컴포넌트 ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;
const ModalContainer = styled.div`
  width: 470px;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`;
const ModalHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px;
  flex-shrink: 0;
`;
const ModalTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #191f28;
  margin: 0;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;
const ModalContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;
const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 20px;
  border-bottom: 1px solid #e8e9e9;
`;
const TabButton = styled.button<{ isActive: boolean }>`
  padding: 10px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: ${(p) => (p.isActive ? "#191F28" : "#8C8F93")};
  border-bottom: 2px solid ${(p) => (p.isActive ? "#191F28" : "transparent")};
`;
const InfoSection = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const DetailLabel = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #8c8f93;
  margin: 0;
`;
const DetailValue = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #191f28;
  margin: 0;
`;
const SpaceImage = styled.img`
  width: 100%;
  height: 190px;
  border-radius: 8px;
  object-fit: cover;
  background-color: #f0f0f0;
`;
const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #e5e5e5;
`;
const FileName = styled.span`
  font-size: 16px;
  color: #191f28;
`;
const FileDeleteButton = styled(CloseButton)``;
const RejectReasonContent = styled.div`
  padding: 24px 20px;
  font-size: 16px;
  color: #191f28;
  line-height: 1.6;
`;
const LoadingState = styled.div`
  padding: 40px;
  text-align: center;
  color: #8c8f93;
`;
const ModalFooter = styled.footer<{ hasButtons: boolean }>`
  display: ${(p) => (p.hasButtons ? "flex" : "none")};
  padding: 24px 20px;
  gap: 12px;
  border-radius: 0px 0px 12px 12px;
  background: #ffffff;
`;
const ActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 12px;
  height: 46px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  background: #e8e9e9;
  color: #191f28;
  border: none;
  flex: 1;
`;
const PrimaryButton = styled(ActionButton)`
  background: #0046ff;
  color: #ffffff;
  flex: 2;
`;
