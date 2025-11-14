"use client";

import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { Checkbox, Input, Button } from "@components/index";
import PrevisitTimeChipGroup from "./components/PrevisitTimeChipGroup";
import ReservationSuccessModal from "./components/ReservationSuccessModal";
import { GapBox } from "@user/components/GapBox";
import Loader from "@user/components/Loader";
import { useRouter } from "next/navigation";

import { useReservationConfirm } from "./hooks/useReservationConfirm";
import ReservationCalendar from "@components/ReservationCalendar";

/**
 * ReservationConfirmPage (UI)
 * - 기존 페이지와 동일한 마크업/스타일을 유지
 * - 모든 상태/로직은 useReservationConfirm 훅에서 분리
 */
export default function ReservationConfirmPage() {
  const router = useRouter();

  const {
    // data / state
    user,
    purpose,
    setPurpose,
    isPrevisitChecked,
    setIsPrevisitChecked,
    files,
    isDragging,
    inputRef,
    openPicker,
    onChange,
    onDrop,
    onDragOver,
    onDragEnter,
    onDragLeave,
    removeAt,

    reservationStore,
    availableDates,

    // previsit
    amOptions,
    pmOptions,
    selectedPrevisitDate,
    selectedPrevisitTime,
    setSelectedPrevisitTime,

    // display
    dateText,
    timeText,

    // control
    handleMonthChange,
    handleSelectPrevisitDate,
    handleSubmit,

    isSuccessModalOpen,
    setIsSuccessModalOpen,
  } = useReservationConfirm();

  return (
    <Wrapper>
      <Loader>
        <Title>예약확인</Title>
        <ContentWrapper>
          {/* 왼쪽 영역: 예약자 정보 입력 */}
          <ReservationForm>
            <SubTitle>예약자 정보</SubTitle>

            <FormGroup>
              <Label htmlFor="name">예약자 이름</Label>
              <Input
                id="name"
                type="text"
                value={user?.userName || ""}
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={user?.userEmail || ""}
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="purpose">사용목적</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="회의나 행사 등 공간의 사용 목적을 입력해주세요"
              />
            </FormGroup>

            {/* 사전답사 영역 */}
            <PreReservationGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <PreReservationLabel>
                  사전답사 예약 (최대 30분)
                </PreReservationLabel>
                <Checkbox
                  checked={isPrevisitChecked}
                  onChange={() => setIsPrevisitChecked(!isPrevisitChecked)}
                />
              </div>

              {isPrevisitChecked && (
                <HiddenComponent>
                  <ReservationCalendar
                    selectsRange={false}
                    selectedEnd={selectedPrevisitDate}
                    selectedStart={selectedPrevisitDate}
                    availableDays={availableDates}
                    onSelectDate={handleSelectPrevisitDate}
                    onMonthChange={handleMonthChange}
                  />

                  {/* 오전/오후 시간 선택 */}
                  <TimeBox>
                    <AM>
                      <span>오전</span>
                      <GapBox h="1rem" />
                      <PrevisitTimeChipGroup
                        options={amOptions}
                        selected={selectedPrevisitTime}
                        onToggle={setSelectedPrevisitTime}
                      />
                    </AM>

                    <GapBox h="1rem" />

                    <PM>
                      <span>오후</span>
                      <GapBox h="1rem" />
                      <PrevisitTimeChipGroup
                        options={pmOptions}
                        selected={selectedPrevisitTime}
                        onToggle={setSelectedPrevisitTime}
                      />
                    </PM>
                  </TimeBox>
                </HiddenComponent>
              )}
            </PreReservationGroup>

            {/* 파일 업로드 */}
            <FormGroup>
              <Label htmlFor="file-upload">첨부파일</Label>
              <SmallText>
                회의나 행사내용 및 일정에 참고가 될 파일을 업로드해 주세요
              </SmallText>
              <FileUploadContainer>
                <ImageUpload
                  onClick={openPicker}
                  onDragOver={onDragOver}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  isDragging={isDragging}
                >
                  <input
                    type="file"
                    ref={inputRef}
                    onChange={onChange}
                    multiple
                    hidden
                  />
                  <IconWrapper>
                    <img src="/icons/upload.svg" />
                  </IconWrapper>
                </ImageUpload>

                <FilePreviewList>
                  {files.map((file, idx) => (
                    <FileItem key={idx}>
                      <FileName>{file.name}</FileName>
                      <CloseButton onClick={() => removeAt(idx)}>
                        <img src="/icons/close.svg" />
                      </CloseButton>
                    </FileItem>
                  ))}
                </FilePreviewList>
              </FileUploadContainer>
            </FormGroup>
          </ReservationForm>

          {/* 오른쪽 영역: 예약 정보 요약 */}
          <ReservationInfoSection>
            <SubTitle>예약 정보</SubTitle>
            <DetailSection>
              <InfoItem>
                <InfoLabel>이용공간</InfoLabel>
                <InfoValue>
                  <SpaceImageWrapper>
                    {reservationStore.spaceImageUrl && (
                      <SpaceImage
                        src={reservationStore.spaceImageUrl}
                        alt="space image"
                      />
                    )}
                  </SpaceImageWrapper>
                  <SpaceInfoText>{reservationStore.spaceName}</SpaceInfoText>
                </InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>이용날짜</InfoLabel>
                <InfoValue>{dateText}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>이용시간</InfoLabel>
                <InfoValue>{timeText}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>이용인원</InfoLabel>
                <InfoValue>{reservationStore.capacity || 0}명</InfoValue>
              </InfoItem>

              <Button
                type="button"
                isActive
                width="100%"
                onClick={handleSubmit}
              >
                예약하기
              </Button>
            </DetailSection>
          </ReservationInfoSection>
        </ContentWrapper>

        {/* 예약 성공 모달 */}
        <ReservationSuccessModal
          isOpen={isSuccessModalOpen}
          title="예약 요청이 완료되었습니다"
          subtitle={`예약은 평균 10분 이내에 확정돼요.
나의 예약 현황은 마이페이지에서 확인할 수 있습니다.`}
          onConfirm={() => {
            setIsSuccessModalOpen(false);
            router.push("/mypage/reservations");
          }}
          onCancel={() => {
            setIsSuccessModalOpen(false);
            router.push("/spaces");
          }}
        />
      </Loader>
    </Wrapper>
  );
}

// --- styled ---
const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10rem;
  //   background-color: yellow;
  display: flex;
  flex-direction: column;

  @media (max-width: 1092px) {
    padding: 0 5rem;
  }

  @media (max-width: 838px) {
    padding: 0 2rem;
  }

  @media (max-width: 771px) {
    padding: 0 1rem;
  }

  @media (max-width: 768px) {
    // justify-content: center;
    align-items: center;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ReservationForm = styled.div`
  width: 22rem;
`;

const SubTitle = styled.h3`
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 2rem;

  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  color: ${colors.graycolor50};
  margin-bottom: 0.5rem;
`;

const SmallText = styled.span`
  display: block;
  font-size: 0.875rem;
  color: ${colors.graycolor50};
  margin-top: 0.25rem;
`;

const ReservationInfoSection = styled.div`
  width: 24rem;
  border: 1px solid ${colors.graycolor10};
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const SpaceImageWrapper = styled.div`
  width: 100%;
  //   position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
`;

const SpaceImage = styled.img`
  width: 100%;
`;

const SpaceInfoText = styled.div`
  font-size: 1rem;
  color: ${colors.graycolor100};
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
`;

const InfoLabel = styled.span`
  font-weight: 400;
  color: ${colors.graycolor50};
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const InfoValue = styled.span`
  font-weight: 500;
  color: ${colors.graycolor100};
  font-size: 1rem;
  font-style: normal;
  line-height: normal;
`;

const FileUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ImageUpload = styled.div<{ isDragging: boolean }>`
  position: relative;
  width: 6.25rem; // 100px
  height: 5.75rem; // 92px
  border-radius: 0.625rem;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.maincolor5 : colors.graycolor5};
  color: ${colors.graycolor50};
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const FilePreviewList = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-top: 1px solid ${colors.graycolor10};
  border-bottom: 1px solid ${colors.graycolor10};
  background-color: white;
  min-height: 3.5rem;
`;

const FileName = styled.span`
  flex: 1;
  margin-left: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.graycolor50};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreReservationGroup = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  width: 100%;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
`;

const PreReservationLabel = styled.label`
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 110%;
`;

const HiddenComponent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  //   background-color: gray;
  padding-top: 1.5rem;
`;

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

const TimeBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

  span {
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 110%; /* 1.1rem */
  }
`;

const AM = styled.div`
  display: flex;
  flex-direction: column;
`;
const PM = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
