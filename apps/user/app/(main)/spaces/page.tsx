"use client";

import styled from "@emotion/styled";
import { GapBox } from "@user/components/GapBox";
import ModalButton from "@user/components/ModalButton";
import DropdownModal from "@user/components/DropdownModal";
import CapacitySelect from "./components/dropdownModal/CapacitySelect";
import FacilitySelect from "./components/dropdownModal/FacilitySelect";
import SpaceInfoCard from "./components/SpaceInfoCard";
import RegionButton from "./components/RegionButton";
import DateTimeSelect from "./components/dropdownModal/DateTimeSelect";
import {
  useHomePage,
  INITIAL_START_LABEL,
  INITIAL_END_LABEL,
} from "./hooks/useHomePage";
import { media } from "@styles/breakpoints";

/**
 * HomePage 컴포넌트
 * ----------------------------
 * 사용자 메인 페이지 (공간 검색 및 목록 표시)
 * - 필터 모달과 검색 결과 공간 카드를 렌더링
 * - 모든 상태 및 로직은 useHomePage 훅에서 관리
 */
export default function HomePage() {
  const {
    openModal,
    regions,
    regionId,
    tagNames,
    meetingRoomList,
    eventHallList,
    tempCapacity,
    tempStartDate,
    tempEndDate,
    tempStartTime,
    tempEndTime,
    tempTagNames,
    showTimePicker,
    startOptions,
    endOptions,
    isDateApplyActive,
    isDateRangeSelected,
    setTempCapacity,
    setTempStartTime,
    setTempEndTime,
    setTempTagNames,
    setOpenModal,
    handleToggle,
    handleRegionSelect,
    handleSelectDate,
    handleApplyCapacity,
    handleApplyDate,
    handleApplyFacilities,
    resetTempsFromCommitted,
  } = useHomePage();

  return (
    <Container>
      <Contents>
        <GapBox h="3.5rem" />
        <Title>
          미팅부터 행사장 예약까지,
          <br />딱 맞는 공간을
          <br />
          무료로 사용해보세요
        </Title>

        <GapBox h="3.5rem" />
        <FilterWrapper>
          {/* 지역 선택 버튼 */}
          <RegionButton
            label="지역"
            options={regions}
            selectedRegionId={regionId}
            onSelect={handleRegionSelect}
          />

          {/* 인원 선택 모달 */}
          <ModalButton
            label="인원"
            isOpen={openModal === "people"}
            onToggle={() => handleToggle("people")}
            modal={
              <DropdownModal
                title="인원 선택"
                onClose={() => {
                  resetTempsFromCommitted(); // 취소 시 임시값 리셋
                  setOpenModal(null);
                }}
                onApply={handleApplyCapacity} // 적용 버튼
                isApplyActive={tempCapacity > 0}
              >
                <CapacitySelect
                  value={tempCapacity}
                  onChange={setTempCapacity} // 임시값 변경
                />
              </DropdownModal>
            }
          />

          {/* 날짜 선택 모달 */}
          <ModalButton
            label={"날짜"}
            isOpen={openModal === "date"}
            onToggle={() => handleToggle("date")}
            modal={
              <DropdownModal
                title="날짜 선택"
                onClose={() => {
                  resetTempsFromCommitted();
                  setOpenModal(null);
                }}
                onApply={handleApplyDate}
                isApplyActive={isDateApplyActive}
              >
                <DateTimeSelect
                  tempStartDate={tempStartDate}
                  tempEndDate={tempEndDate}
                  tempStartTime={tempStartTime}
                  tempEndTime={tempEndTime}
                  showTimePicker={showTimePicker}
                  startOptions={startOptions}
                  endOptions={endOptions}
                  INITIAL_START_LABEL={INITIAL_START_LABEL}
                  INITIAL_END_LABEL={INITIAL_END_LABEL}
                  onSelectDate={handleSelectDate}
                  setTempStartTime={setTempStartTime}
                  setTempEndTime={setTempEndTime}
                  isRange={isDateRangeSelected}
                />
              </DropdownModal>
            }
          />

          {/* 편의시설 선택 모달 */}
          <ModalButton
            label="편의시설"
            isOpen={openModal === "tags"}
            onToggle={() => handleToggle("tags")}
            modal={
              <DropdownModal
                title="편의시설 선택"
                onClose={() => {
                  resetTempsFromCommitted(); // 취소 시 임시값 리셋
                  setOpenModal(null);
                }}
                onApply={handleApplyFacilities}
                isApplyActive={tempTagNames.length >= 0}
              >
                <FacilitySelect
                  facilities={tagNames}
                  selectedFacilities={tempTagNames}
                  setSelectedFacilities={setTempTagNames} // 임시값 변경
                />
              </DropdownModal>
            }
          />
        </FilterWrapper>

        {/* 미팅룸 섹션 */}
        {meetingRoomList.length != 0 && (
          <MeetingRoomWrapper>
            <CategoryTitle>미팅룸</CategoryTitle>
            <Grid>
              {meetingRoomList.map((room) => (
                <SpaceInfoCard key={room.spaceId} {...room} />
              ))}
            </Grid>
          </MeetingRoomWrapper>
        )}

        {/* 행사장 섹션 */}
        {eventHallList.length != 0 && (
          <EventHallWrapper>
            <CategoryTitle>행사장</CategoryTitle>
            <Grid>
              {eventHallList.map((hall) => (
                <SpaceInfoCard key={hall.spaceId} {...hall} />
              ))}
            </Grid>
          </EventHallWrapper>
        )}

        {/* 검색 결과 없음 */}
        {meetingRoomList.length == 0 && eventHallList.length == 0 && (
          <div>검색 결과가 없습니다.</div>
        )}
      </Contents>
    </Container>
  );
}

// --- styled ---
const Container = styled.div`
  padding: 2rem 1.25rem;
  display: flex;
  width: 100%;

  /* 데스크탑 여백 */
  ${media.mobileUp} {
    padding: 3.5rem 9.4rem 5.5rem 9.4rem;
  }
`;
const Contents = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const Title = styled.h4`
  font-size: 2.25rem;
  font-weight: 700;
  color: #222;
`;

const CategoryTitle = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #222;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;

  @media (max-width: 767px) {
    overflow-x: auto; /* 가로 스크롤 활성화 */
    flex-wrap: nowrap; /* 필터 버튼이 다음 줄로 넘어가지 않도록 설정 */
    padding-bottom: 0.5rem; /* 스크롤바가 콘텐츠를 가리지 않도록 하단 여백 추가 */

    /* (옵션) 스크롤바 숨기기 */
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  /* 데스크탑에서는 wrap 유지 */
  ${media.mobileUp} {
    flex-wrap: wrap;
    overflow-x: visible;
    padding-bottom: 0;
  }
`;

const MeetingRoomWrapper = styled.div`
  margin-top: 2rem;
`;

const EventHallWrapper = styled.div`
  margin-top: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 22rem);
  gap: 1.5rem;
  margin-top: 1.5rem;
  width: 100%;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;
