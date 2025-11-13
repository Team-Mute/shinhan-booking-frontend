"use client";
import React from "react";
import { useSpaceDetail } from "./hooks/useSpaceDetail";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import SpaceDetailTabs from "./components/SpaceDetailTabs";
import SelectBox2 from "@components/ui/selectbox/Selectbox2";
import CapacitySelect from "../../components/dropdownModal/CapacitySelect";
import { Button } from "@components/index";
import Loader from "@user/components/Loader";
import ReservationCalendar from "@components/ReservationCalendar";
import { media } from "@styles/breakpoints";
import SpaceImageGallery from "./components/SpaceImageGallery";

/**
 * SpaceDetailPage 컴포넌트
 * ----------------------------
 * 공간 상세 페이지 전체 레이아웃
 * - 이미지 갤러리, 공간 정보, 예약 정보 표시
 * - 모바일/데스크탑 레이아웃 대응
 */
export default function SpaceDetailPage() {
  // ---------------- Space 상세/예약 상태 가져오기 ----------------
  const {
    spaceDetail,
    reservationStore,
    availableDates,
    spaceIdParam,
    selectedStartDate,
    selectedEndDate,
    isRangeSelected,
    isReservable,
    adjustedStartTimeOptions,
    adjustedEndTimeOptions,
    setReservation,
    handleMonthChange,
    handleSelectDate,
    handleChangeCapacity,
    handleReservationClick,
  } = useSpaceDetail();

  // spaceIdParam 없으면 렌더링하지 않음 (로딩 또는 에러 처리)
  if (!spaceIdParam) return null;

  return (
    <DetailWrapper>
      <Loader>
        {/* 공간 이미지 렌더링 컴포넌트 */}
        <SpaceImageGallery spaceDetail={spaceDetail} />

        {/* [공간 정보]와 [예약 정보]를 담는 Wrapper */}
        <InfoWrapper>
          {/* 모바일 전용 간단 정보(공간 이름, 접근성, 태그) */}
          {/* SpaceInfo 내의 SpaceSimpleInfoWrapper와 동일 */}
          <MobileSpaceSimpleInfoWrapper>
            <SpaceTitle>{spaceDetail?.spaceName}</SpaceTitle>
            <SpaceAccessInfo>
              {spaceDetail?.location.addressInfo}
            </SpaceAccessInfo>
            <TagsInfo>
              {spaceDetail?.tagNames.map((tag, idx) => (
                <Tag key={idx}>{tag}</Tag>
              ))}
            </TagsInfo>
          </MobileSpaceSimpleInfoWrapper>
          {/* 공간 정보 */}
          <SpaceInfo>
            <SpaceSimpleInfoWrapper>
              <SpaceTitle>{spaceDetail?.spaceName}</SpaceTitle>
              <SpaceAccessInfo>
                {spaceDetail?.location.addressInfo}
              </SpaceAccessInfo>
              <TagsInfo>
                {spaceDetail?.tagNames.map((tag, idx) => (
                  <Tag key={idx}>{tag}</Tag>
                ))}
              </TagsInfo>
            </SpaceSimpleInfoWrapper>
            <SpaceDetailWrapper>
              <SpaceDetailTabs spaceDetail={spaceDetail} />
            </SpaceDetailWrapper>
          </SpaceInfo>
          {/* 예약 정보 */}
          <ReservationInfo>
            <RTitle>예약 정보</RTitle>
            <RInfoWrapper>
              <SubTitle>이용공간</SubTitle>
              {/* 공간 이름 */}
              <Value>{spaceDetail?.spaceName}</Value>
            </RInfoWrapper>
            <RInfoWrapper>
              <SubTitle>이용날짜</SubTitle>
              {/* 예약 캘린더 */}
              <Value>
                <ReservationCalendar
                  selectsRange={true}
                  onSelectDate={handleSelectDate}
                  selectedStart={selectedStartDate}
                  selectedEnd={selectedEndDate}
                  onMonthChange={handleMonthChange}
                  availableDays={availableDates}
                />
              </Value>
            </RInfoWrapper>
            <RInfoWrapper>
              <SubTitle>이용시간</SubTitle>
              {/* 공간 이용 시간 */}
              <Value>
              <TimePickerWrapper>
                {isRangeSelected ? (
                  // isRangeSelected가 true일 때 표시할 문구
                  <RangeInfo>
                    하루가 아닌 기간으로 예약할 시 운영시간 전체로 예약이 됩니다. 운영시간을 공간 안내에서 확인해 주세요.
                  </RangeInfo>
                ) : (
                  // isRangeSelected가 false일 때 시간 선택 SelectBox 렌더링
                  <>
                    {/* 시작 시간 */}
                    <SelectBox2
                      options={adjustedStartTimeOptions}
                      value={reservationStore.time?.start || ""}
                      placeholder="시작 시간 선택"
                      disabled={!selectedStartDate || isRangeSelected}
                      onChange={(opt) => {
                        setReservation({ time: { start: opt, end: undefined } });
                      }}
                    />

                    <span>~</span>

                    {/* 종료 시간 */}
                    <SelectBox2
                      options={adjustedEndTimeOptions}
                      value={reservationStore.time?.end || ""}
                      placeholder="종료 시간 선택"
                      disabled={isRangeSelected || !reservationStore.time?.start}
                      onChange={(opt) => {
                        const start = reservationStore.time?.start || "";
                        setReservation({ time: { start: start, end: opt } });
                      }}
                    />
                  </>
                )}
            </TimePickerWrapper>
            </Value>
            </RInfoWrapper>
            <RInfoWrapper>
              <SubTitle>이용인원</SubTitle>
              {/* 공간 이용 인원 */}
              <Value>
                <CapacitySelect
                  value={reservationStore.capacity ?? 1}
                  onChange={handleChangeCapacity}
                />
              </Value>
            </RInfoWrapper>
            <ButtonWrapper>
              {/* 예약 페이지 이동 버튼 - 로그인 시에만 가능 */}
              <ReservationButton
                isActive={!!isReservable && spaceDetail?.spaceIsAvailable !== false}
                disabled={!isReservable || spaceDetail?.spaceIsAvailable === false}
                onClick={handleReservationClick}
              >
                예약하러 가기
              </ReservationButton>
            </ButtonWrapper>
          </ReservationInfo>
        </InfoWrapper>
      </Loader>
    </DetailWrapper>
  );
}

// --- styled ---
const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 10.56rem;

  @media (max-width: 1040px) {
    padding: 0 5%;
  }

  /* 모바일에서 100vw 이미지 사용을 위해 padding을 0으로 설정 */
  ${media.mobile} {
    padding: 0;
  }
`;

const InfoWrapper = styled.div`
  width: 100%;
  // margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  gap: 3.91rem;
  ${media.mobile} {
    flex-direction: column;
    gap: 3%;
    background-color: ${colors.graycolor10};
  }
`;

const MobileSpaceSimpleInfoWrapper = styled.div`
  display: none; /* 데스크탑에서는 숨김 */

  ${media.mobile} {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    order: -1; // 맨 위로
    background-color: white;
    padding: 1.25rem;
  }
`;

const SpaceInfo = styled.div`
  max-width: 40.3rem;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 3.5rem;

  ${media.mobile} {
    max-width: 100%;
  }
`;

const ReservationInfo = styled.div`
  max-width: 24rem;
  border-radius: 0.75rem;
  border: 1px solid ${colors.graycolor5};
  width: 100%;
  background-color: white;

  padding: 1.25rem;

  display: flex;
  flex-direction: column;

  ${media.mobile} {
    max-width: 100%;
    order: -1;
    border: none;
    border-radius: 0;
  }
`;

const RTitle = styled.div`
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 2rem;
`;

const RInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;

  padding: 1rem 0;
  gap: 1rem;
`;

const SubTitle = styled.span`
  color: rgba(0, 0, 0, 0.5);

  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Value = styled.span`
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const SpaceSimpleInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${media.mobile} {
    display: none; /* 모바일에서는 숨김 */
  }
`;

const SpaceTitle = styled.span`
  color: ${colors.graycolor100};
  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const SpaceAccessInfo = styled.span`
  font-family: Pretendard;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  margin-top: 0.5rem;
`;

const TagsInfo = styled.div`
  margin-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.div`
  border-radius: 1.25rem;
  background-color: ${colors.maincolor5};
  color: ${colors.maincolor};
  padding: 0.25rem 0.75rem;

  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
`;

const SpaceDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ButtonWrapper = styled.div`
  margin: 1.5rem 0;
`;

const RangeInfo = styled.div`
  padding: 8px 0;
  textAlign: center;
  width: 100%;
  color: #191F28;
`

// 예약하기 버튼 
interface ReservationButtonProps {
  isActive: boolean;
}
const ReservationButton = styled.button<ReservationButtonProps>`
  width: 100%;
  height: 46px;
  border-radius: 8px;
  border: none;
  background-color: ${({ isActive }) => 
    isActive ? colors.maincolor : colors.graycolor10};
    
  color: ${({ isActive }) => 
    isActive ? "white" : colors.graycolor100};
    
  cursor: ${({ isActive }) => (isActive ? "pointer" : "not-allowed")};

  font-size: 14px;
  transition: background-color 0.3s ease;
`;