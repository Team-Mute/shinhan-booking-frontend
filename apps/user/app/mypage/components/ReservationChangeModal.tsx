"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Calendar from "@components/Calendar"; // 기존 캘린더 컴포넌트 경로
import { updateReservationApi } from "@user/lib/api/reservation"; // 실제 사용할 예약 수정 API

// --- 타입 정의 ---
interface ReservationDetails {
  spaceName: string;
  spaceImageUrl: string | null;
  orderId: string;
  reservationFrom: string;
  reservationTo: string;
  reservationHeadcount: number;
  reservationPurpose: string;
  previsits: { previsitId: number; previsitFrom: string; previsitTo: string }[];
  reservationAttachment?: string[];
}

interface ReservationChangeModalProps {
  isOpen: boolean;
  onClose: (isChanged?: boolean) => void;
  reservationData: ReservationDetails | null;
}

// --- 컴포넌트 ---
export default function ReservationChangeModal({
  isOpen,
  onClose,
  reservationData,
}: ReservationChangeModalProps) {
  const [formData, setFormData] = useState<Partial<ReservationDetails>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [headcount, setHeadcount] = useState(0);

  useEffect(() => {
    if (reservationData) {
      setFormData(reservationData);
      setSelectedDate(new Date(reservationData.reservationFrom));
      setHeadcount(reservationData.reservationHeadcount);
    }
  }, [reservationData]);

  if (!isOpen || !reservationData) return null;

  const handleDateSelect = ({ single }: { single?: string }) => {
    if (single) {
      setSelectedDate(new Date(single.replace(/:/g, "-")));
    }
  };

  const handleSaveChanges = async () => {
    // TODO: 실제 예약 수정 API 호출 로직 구현
    console.log("Saving changes:", {
      ...formData,
      reservationFrom: selectedDate?.toISOString(),
      reservationHeadcount: headcount,
    });
    // await updateReservationApi(reservationData.id, formData);
    alert("예약이 성공적으로 변경되었습니다.");
    onClose(true); // 변경 완료 후 모달 닫기
  };

  return (
    <ModalOverlay onClick={() => onClose()}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>예약 변경하기</ModalTitle>
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
          <InfoSection>
            <DetailLabel>이용공간</DetailLabel>
            {reservationData.spaceImageUrl && (
              <SpaceImage
                src={reservationData.spaceImageUrl}
                alt={reservationData.spaceName}
              />
            )}
            <DetailValue>{reservationData.spaceName}</DetailValue>
          </InfoSection>

          <FormSection>
            <FormItem>
              <DetailLabel>이용날짜</DetailLabel>
              <Calendar
                onSelectDate={handleDateSelect}
                selectedDate={selectedDate}
              />
            </FormItem>

            <FormItem>
              <DetailLabel>이용시간</DetailLabel>
              <TimeInputContainer>
                <TimeInput
                  type="time"
                  defaultValue={new Date(reservationData.reservationFrom)
                    .toTimeString()
                    .substring(0, 5)}
                />
                <span>~</span>
                <TimeInput
                  type="time"
                  defaultValue={new Date(reservationData.reservationTo)
                    .toTimeString()
                    .substring(0, 5)}
                />
              </TimeInputContainer>
            </FormItem>

            <FormItem>
              <DetailLabel>이용인원</DetailLabel>
              <HeadcountContainer>
                <span>인원</span>
                <HeadcountControl>
                  <button
                    onClick={() => setHeadcount((p) => Math.max(0, p - 1))}
                  >
                    -
                  </button>
                  <span>{headcount}</span>
                  <button onClick={() => setHeadcount((p) => p + 1)}>+</button>
                </HeadcountControl>
              </HeadcountContainer>
            </FormItem>

            <FormItem>
              <DetailLabel>사용목적</DetailLabel>
              <PurposeInput
                placeholder="회의나 행사등 공간의 사용 목적을 입력해주세요"
                defaultValue={reservationData.reservationPurpose}
              />
            </FormItem>

            <FormItem>
              <DetailLabel>사전답사 예약 (최대 30분)</DetailLabel>
              <Calendar onSelectDate={() => {}} />
            </FormItem>

            <FormItem>
              <DetailLabel>첨부파일</DetailLabel>
              <UploadBox>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 16.5V7.5M12 7.5L8.5 11M12 7.5L15.5 11"
                    stroke="#8C8F93"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"
                    stroke="#8C8F93"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </UploadBox>
              {reservationData.reservationAttachment?.map((url) => (
                <FileListItem key={url}>
                  <span>{url.split("/").pop()}</span>
                  <button>X</button>
                </FileListItem>
              ))}
            </FormItem>
          </FormSection>
        </ModalContent>
        <ModalFooter>
          <SubmitButton onClick={handleSaveChanges}>
            예약 수정 완료
          </SubmitButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}

// --- Styled Components (CSS 명세 기반) ---
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
  height: 90vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
`;
const ModalHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px;
  flex-shrink: 0;
`;
const ModalTitle = styled.h1`
  font-family: "Pretendard";
  font-weight: 600;
  font-size: 24px;
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
  padding: 0 20px;
`;
const InfoSection = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid #e8e9e9;
`;
const FormSection = styled.div`
  padding: 16px 0;
`;
const FormItem = styled.div`
  padding: 16px 0;
`;
const DetailLabel = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #8c8f93;
  margin: 0 0 12px 0;
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
  margin-bottom: 8px;
`;
const TimeInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const TimeInput = styled.input`
  width: 160px;
  height: 46px;
  padding: 0 12px;
  border: 1px solid #e8e9e9;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
`;
const HeadcountContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #191f28;
  font-size: 16px;
  font-weight: 600;
`;
const HeadcountControl = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  button {
    width: 23px;
    height: 23px;
    border-radius: 50%;
    border: none;
    background: #f2f6ff;
    color: #0046ff;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  span {
    font-size: 16px;
    font-weight: 600;
  }
`;
const PurposeInput = styled.textarea`
  width: 100%;
  height: 51px;
  padding: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  resize: vertical;
  box-sizing: border-box;
  font-family: "Pretendard";
`;
const UploadBox = styled.label`
  width: 100px;
  height: 92px;
  background: #f3f4f4;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const FileListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e5e5e5;
  font-size: 16px;
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }
`;
const ModalFooter = styled.footer`
  padding: 24px 20px;
  background: #ffffff;
  border-top: 1px solid #e8e9e9;
`;
const SubmitButton = styled.button`
  width: 100%;
  height: 46px;
  background: #0046ff;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
`;
