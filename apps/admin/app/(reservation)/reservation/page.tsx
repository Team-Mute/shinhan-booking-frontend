"use client";

import React from "react";
import { css } from "@emotion/react";

import styled from "@emotion/styled";
import { IoCheckmarkSharp } from "react-icons/io5"; // 체크마크 아이콘 추가
import {
  formatDate,
  formatTimeRange,
  getStatusStyle,
} from "@admin/lib/utils/reservationUtils";
import Loader from "@admin/components/Loader";
import InfoModal from "../../../components/modal/InfoModal";
import { BulkApproveModal, ConfirmModal, DetailModal, RejectModal } from "./components";
import { useReservation } from "./hooks/useReservation";

/**
 * ReservationManagementPage 컴포넌트
 * ----------------------------
 * 예약 관리 페이지
 *
 * @description
 * - 예약 목록 조회, 필터링 (상태, 지점) 및 페이지네이션
 * - 예약자명/공간명 키워드 검색
 * - 예약 승인 (단건/일괄) 및 반려 처리
 * - 상세 보기, 일괄 승인, 반려 모달 제어
 * - 모든 상태 및 비즈니스 로직은 useReservation 훅에서 관리.
 */
const ReservationManagementPage: React.FC = () => {
  const {
    // 상태 및 데이터
    reservations,
    statuses,
    regions,
    flags,
    keyword,
    isShinhan,
    isEmergency,
    adminRoleId,

    // 페이지네이션
    uiCurrentPage,
    totalPages,

    // 체크박스
    selectedItems,
    isAllApprovableSelected,

    // 모달 상태 및 데이터
    isBulkConfirmModalOpen,
    reservationsToApprove,
    isRejectModalOpen,
    rejectionReason,
    isDetailModalOpen,
    selectedReservationForDetail,

    // 핸들러 함수
    handlePageChange,
    handleFilterChange,
    handleKeywordChange,
    handleKeywordSearch,
    handleFlagToggle,

    // 액션 핸들러
    handleApprove,
    handleApproveSelected,
    confirmBulkApprove,
    handleReject,
    handleRejectionReasonChange,
    confirmReject,

    // 체크박스 핸들러
    handleSingleSelect,
    handleSelectAll,

    // 모달 닫기
    handleRejectModalClose,
    handleDetailClick,
    handleDetailModalClose,
    handleBulkConfirmModalClose
  } = useReservation();
return (
    <MainContainer>
      <Loader>
      <Header>
        <PageTitle>예약 관리</PageTitle>
      </Header>
      <SectionTitle>예약 목록</SectionTitle>

      {/* Filter and Search Section (Responsive) */}
      <FilterSearchWrapper>
        {/* 예약 상태 드롭다운 */}
        <DropdownContainer>
          <StyledSelect
            // 훅의 핸들러 사용
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">예약 상태 전체</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </StyledSelect>
        </DropdownContainer>

        {/* 지점 드롭 다운은 2차 승인자, master만 적용 */}
        {adminRoleId === 0 || adminRoleId === 1 ? (
          <DropdownContainer>
            <StyledSelect
              // 훅의 핸들러 사용
              onChange={(e) => handleFilterChange("region", e.target.value)}
            >
              <option value="">지점</option>
              {regions.map((region) => (
                <option key={region.regionId} value={region.regionId}>
                  {region.regionName}
                </option>
              ))}
            </StyledSelect>
          </DropdownContainer>
        ) : null}
        <SearchInputContainer>
          <SearchInput
            type="text"
            placeholder="예약자명, 공간으로 검색"
            // 입력창의 현재 값을 keyword 상태와 연결
            value={keyword}
            // 입력값이 변경될 때마다 keyword 상태 업데이트
            onChange={(e) => handleKeywordChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // 엔터 키를 누르면 훅의 검색 실행 함수 호출
                handleKeywordSearch();
              }
            }}
          />
        </SearchInputContainer>

        <ActionButtons>
          {flags.map((flag) => (
            // 신한 예약 보기 / 긴급 예약 보기 Flag
            <FilterButton
              key={flag.key}
              // 훅의 핸들러 사용
              onClick={() => handleFlagToggle(flag.key as 'isShinhan' | 'isEmergency')}
              isActive={flag.key === "isShinhan" ? isShinhan : isEmergency}
            >
              {flag.label}
            </FilterButton>
          ))}
        </ActionButtons>
      </FilterSearchWrapper>

      {/* Table Header and Actions (Responsive) */}
      <HeaderActions>
        <SelectAllContainer htmlFor="selectAllCheckbox">
          <HiddenCheckbox
            type="checkbox"
            id="selectAllCheckbox"
            // 훅에서 계산된 상태 사용
            checked={isAllApprovableSelected}
            // 훅의 핸들러 사용 (event 인수는 필요 없도록 훅에서 처리)
            onChange={handleSelectAll}
          />
          <CustomCheckbox isChecked={isAllApprovableSelected}>
            {isAllApprovableSelected && <IoCheckmarkSharp size={16} />}
          </CustomCheckbox>
          <SelectAllText>전체 선택</SelectAllText>
        </SelectAllContainer>
        <ApproveAllButton onClick={handleApproveSelected}>
          선택 승인
        </ApproveAllButton>
      </HeaderActions>

      {/* Reservation List (Responsive) */}
      <ReservationList>
        {reservations.map((reservation) => (
          <ReservationItem key={reservation.reservationId}>
            <ThumbContainer>
              <SelectAllContainer
                htmlFor={`checkbox-${reservation.reservationId}`}
              >
                <HiddenCheckbox
                  type="checkbox"
                  id={`checkbox-${reservation.reservationId}`}
                  checked={selectedItems.includes(reservation.reservationId)}
                  // 훅의 핸들러 사용
                  onChange={() =>
                    handleSingleSelect(
                      reservation.reservationId,
                      reservation.isApprovable
                    )
                  }
                  disabled={!reservation.isApprovable}
                />
                <CustomCheckbox
                  isChecked={selectedItems.includes(reservation.reservationId)}
                >
                  {selectedItems.includes(reservation.reservationId) && (
                    <IoCheckmarkSharp size={16} />
                  )}
                </CustomCheckbox>
              </SelectAllContainer>
            </ThumbContainer>
            <ReservationInfo>
              <InfoRow>
                <StatusBadge $statusId={reservation.statusId}>{reservation.reservationStatusName}</StatusBadge>
                <SpaceNameCls>
                  {reservation.spaceName}
                </SpaceNameCls>
                <SubTextCls>
                  예약자명 : {reservation.userName}
                </SubTextCls>
                {reservation.isShinhan && <ShinhanTag>신한</ShinhanTag>}
                {reservation.isEmergency && <EmergencyTag>긴급</EmergencyTag>}
              </InfoRow>
              <DetailInfo>
                <DetailItem>
                  <DateText>{formatDate(reservation.reservationFrom)}</DateText>
                </DetailItem>
                <DetailItem>
                  <DateText>{"|"}</DateText>
                </DetailItem>
                <DetailItem>
                  <DateText>
                    {formatTimeRange(
                      reservation.reservationFrom,
                      reservation.reservationTo
                    )}
                  </DateText>
                </DetailItem>
                {reservation.previsits && reservation.previsits.length > 0 && (
                  <>
                    <DetailItem>
                      <span>
                        사전답사{" "}
                        {formatDate(reservation.previsits[0]?.previsitFrom)}
                      </span>
                    </DetailItem>
                    <DetailItem>
                      <span>{"|"}</span>
                    </DetailItem>
                    <DetailItem>
                      <span>
                        {formatTimeRange(
                          reservation.previsits[0]?.previsitFrom,
                          reservation.previsits[0]?.previsitTo
                        )}
                      </span>
                    </DetailItem>
                  </>
                )}
              </DetailInfo>
            </ReservationInfo>
            <ItemActions>
              <DetailButton
                onClick={() => handleDetailClick(reservation.reservationId)}
              >
                상세 보기
              </DetailButton>
              {/* 승인하기 버튼 - isApprovable 값에 따라 비활성화 */}
              <ApproveActionButton
                disabled={!reservation.isApprovable}
                onClick={() => handleApprove(reservation.reservationId)} // 훅의 핸들러 호출
              >
                승인하기
              </ApproveActionButton>
              {/* 반려하기 버튼 - isRejectable 값에 따라 비활성화 */}
              <RejectActionButton
                disabled={!reservation.isRejectable}
                onClick={() => handleReject(reservation.reservationId)} // 훅의 핸들러 호출
              >
                반려하기
              </RejectActionButton>
            </ItemActions>
          </ReservationItem>
        ))}
      </ReservationList>

      {/* Pagination */}
      <PaginationNav>
        <PaginationList>
          <PaginationItem
            isArrow
            onClick={() => handlePageChange(uiCurrentPage - 1)}
          >
            {"<"}
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem
              key={page}
              isActive={page === uiCurrentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationItem>
          ))}
          <PaginationItem
            isArrow
            onClick={() => handlePageChange(uiCurrentPage + 1)}
          >
            {">"}
          </PaginationItem>
        </PaginationList>
      </PaginationNav>

      {/* InfoModal(알림) 컴포넌트 */}
      <InfoModal/>
      {/* 단건 승인 확인용 ConfirmModal */}
      <ConfirmModal/>
      {/* 일괄승인 모달 */}
      <BulkApproveModal
        isOpen={isBulkConfirmModalOpen} // 훅의 상태 사용
        reservations={reservationsToApprove} // 훅의 상태 사용
        onConfirm={confirmBulkApprove} // 훅의 핸들러 사용
        onCancel={handleBulkConfirmModalClose}
      />
      {/* 반려하기 모달 */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={handleRejectModalClose} // 훅의 닫기 핸들러 사용
        onConfirm={confirmReject} // 훅의 최종 확정 핸들러 사용
        rejectionReason={rejectionReason} // 훅의 상태 사용
        setRejectionReason={handleRejectionReasonChange} // 훅의 핸들러 사용
      />
      {/* 상세 보기 모달 */}
      <DetailModal
        isOpen={isDetailModalOpen} // 훅의 상태 사용
        onClose={handleDetailModalClose} // 훅의 닫기 핸들러 사용
        onApproveClick={handleApprove}
        onRejectClick={handleReject}
        reservationId={selectedReservationForDetail} // 훅의 상태 사용
      />
      </Loader>
    </MainContainer>
  );
};
export default ReservationManagementPage;

// --- styled ---
const SpaceNameCls = styled.span`
  font-weight: bold;
  color: #333;
  word-break: break-all;
`;

const SubTextCls = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
`;

const MainContainer = styled.main`
  flex: 1;
  padding: 1rem;
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const PageTitle = styled.h1`
  /* 피그마 CSS 기반 스타일 적용 */
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  letter-spacing: -0.011em;
  color: #000000;

  /* 기존 스타일 유지 및 일부 조정 */
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  /* 피그마 CSS 기반 스타일 적용 */
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.011em;
  color: #000000;

  /* 기존 스타일 유지 및 일부 조정 */
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const FilterSearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  gap: 12px;

  // 너비를 유연하게 조절
  flex: 1;
  min-width: 60px;
  max-width: 150px;

  height: 41px;
  background: #f3f4f4;
  border-radius: 12px;
`;

// select 태그에 직접 적용할 스타일
const StyledSelect = styled.select`
  border: none;
  background: transparent;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const FilterButton = styled.button<{ isActive?: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  transition: background-color 0.2s ease, color 0.2s ease;

  // 비활성화 시 스타일
  background-color: #f3f4f4;
  color: #4b5563;

  // 활성화 시 스타일 (props.isActive가 true일 때 적용)
  ${(props) =>
    props.isActive &&
    css`
      background-color: #f2f6ff;
      color: #0046ff;
    `}

  &:hover {
    background-color: ${(props) => (props.isActive ? "#d1e1ff" : "#e0e0e0")};
  }
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;

  /* 너비 조절 */
  flex: 1; /* 남은 공간을 모두 채우도록 변경 */
  min-width: 250px; /* 최소 너비를 250px로 늘려 너무 좁아지지 않게 함 */
  max-width: 500px; /* 최대 너비를 500px로 제한 */
  height: 41px;

  background: #f3f4f4;
  border-radius: 12px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  width: 100%;
  font-size: 14px;
  color: #1a1a1a;

  &:focus {
    outline: none;
  }
`;
const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  @media (min-width: 768px) {
    flex-direction: row;
    width: auto;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  gap: 0.5rem;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const SelectAllContainer = styled.label`
  /* label로 변경하여 input과 연결 */
  display: flex;
  align-items: center;
  cursor: pointer;
`;

// 커스텀 체크박스 스타일
const CustomCheckbox = styled.span<{ isChecked: boolean }>`
  /* 피그마 CSS 기반 스타일 적용 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none; /* 테두리 제거 */
  border-radius: 9px; /* 원형에 가까운 모양으로 변경 */
  margin-right: 0.5rem;
  transition: all 0.2s ease;

  background-color: ${(props) => (props.isChecked ? "#E8E9E9" : "#E8E9E9")};
  color: #191f28; /* 체크마크 색상 */

  ${(props) =>
    props.isChecked &&
    css`
      background-color: #e8e9e9;
    `}
`;

const HiddenCheckbox = styled.input`
  /* 실제 체크박스는 숨김 */
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
`;

const ApproveAllButton = styled.button`
  /* 피그마 CSS 기반 스타일 적용 */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 12px; /* padding 값을 조정하여 텍스트가 잘리지 않도록 함 */
  gap: 8px;

  height: 30px;

  background-color: #f2f6ff; /* 기존 색상 유지 */
  color: #0046ff; /* 기존 색상 유지 */
  border-radius: 8px; /* 피그마와 동일한 값 적용 */
  font-size: 12px; /* 피그마와 동일한 값 적용 */
  font-weight: 500;
  line-height: 14px;
  border: none;

  /* 기존 반응형 스타일은 유지 */
  width: 100%;
  &:hover:not(:disabled) {
    background-color: #d1e1ff;
  }
  @media (min-width: 768px) {
    width: auto;
  }
`;

const ReservationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReservationItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const ReservationInfo = styled.div`
  flex-grow: 1;
  margin-top: 0.5rem;
  @media (min-width: 768px) {
    margin-left: 1rem;
    margin-top: 0;
  }
`;

// 상태별 색상 스타일 (동적)
const StatusStyle = styled.span<{ $statusId: number }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.75rem;
  ${({ $statusId }) => getStatusStyle($statusId)};
`;

// 기본 뱃지 스타일 (정적)
const StatusBadge = styled(StatusStyle)`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const DetailInfo = styled.div`
  /* 피그마 CSS 기반 스타일 적용 */
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 4px;

  /* 기존 스타일 유지 및 일부 조정 */
  color: #6b7280;
  font-size: 0.875rem;

  /* 반응형 스타일 */
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1rem;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

// 날짜 텍스트를 위한 새로운 styled component
const DateText = styled.span`
  /* 피그마 CSS 기반 스타일 적용 */
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 14px;
  letter-spacing: -0.011em;
  color: #191f28;
`;

const DetailItemPrevisit = styled.div`
  /* 피그마 CSS 기반 스타일 적용 */
  display: flex;
  align-items: center;
  font-size: 0.75rem;

  /* 기존 스타일 유지 및 일부 조정 */
  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  gap: 0.5rem;
  width: 100%;
  @media (min-width: 768px) {
    flex-direction: row;
    margin-top: 0;
    width: auto;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  width: 100%;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  @media (min-width: 768px) {
    width: auto;
  }
`;

const DetailButton = styled(ActionButton)`
  /* 피그마 CSS 기반 스타일 적용 */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 12px; /* 텍스트가 잘리지 않도록 padding 조정 */
  gap: 8px;
  height: 30px;
  background: #f3f4f4; /* 피그마와 동일한 배경색 적용 */
  color: #4b5563; /* 피그마와 동일한 텍스트 색상 적용 */
  border-radius: 8px; /* 피그마와 동일한 값 적용 */
  border: none; /* 기존 테두리 제거 */
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;

  width: auto;
  &:hover:not(:disabled) {
    background-color: #e0e0e0;
  }
`;

const ApproveActionButton = styled(ActionButton)`
  padding: 8px 12px;
  background-color: #f2f6ff;
  color: #3b82f6;
  border-radius: 8px;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  border: none;
  width: auto;
  &:hover:not(:disabled) {
    background-color: #d1e1ff;
  }
`;

const RejectActionButton = styled(ActionButton)`
  padding: 8px 12px;
  background-color: #fff2f2;
  color: #ff0000;
  border-radius: 8px;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  border: none;
  width: auto;
  &:hover:not(:disabled) {
    background-color: #ffd1d1;
  }
`;

// 페이지네이션 Wrapper
const PaginationNav = styled.nav`
  /* 피그마 CSS 기반 스타일 적용 */
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 8px;

  /* 기존 스타일 유지 및 일부 조정 */
  justify-content: center;
  margin-top: 2rem;
`;

// 페이지네이션 UL
const PaginationList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  gap: 0.25rem; /* 항목 간 간격 줄이기 */
`;

// 페이지네이션 각 항목
const PaginationItem = styled.li<{ isActive?: boolean; isArrow?: boolean }>`
  /* 기본 스타일 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;

  background-color: transparent;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s ease;

  /* 활성 상태 스타일 */
  ${(props) =>
    props.isActive &&
    css`
      background-color: #e8e9e9;
      color: #000000;
    `}

  /* 비활성 상태 스타일 (눌리지 않은 숫자) */
    ${(props) =>
    !props.isActive &&
    !props.isArrow &&
    css`
      background-color: transparent;
      &:hover {
        background-color: #f3f4f6;
      }
      color: #8c8f93;
    `}

    /* 화살표 버튼 스타일 */
    ${(props) =>
    props.isArrow &&
    css`
      background-color: transparent;
      border: none;

      &:hover {
        background-color: transparent;
      }
    `}
`;

const ShinhanTag = styled.span`
  /* 피그마 CSS 기반 스타일 적용 */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;

  background: #f2f6ff;
  border-radius: 4px;

  /* 텍스트 스타일 */
  font-size: 0.75rem; /* 피그마에 명시되지 않았지만, 다른 태그와 유사하게 적용 */
  font-weight: 700;
  color: #0046ff;
`;

const EmergencyTag = styled.span`
  /* 피그마 CSS 기반 스타일 적용 */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;

  background: #fff2f2;
  border-radius: 4px;

  /* 텍스트 스타일 */
  font-size: 0.75rem; /* 피그마에 명시되지 않았지만, 다른 태그와 유사하게 적용 */
  font-weight: 700;
  color: #ff0000;
`;

// "전체 선택" 텍스트 색상
const SelectAllText = styled.span`
  color: #4b5563;
`;

// 예약 리스트 아이템 내부 썸네일/왼쪽 영역 등(주석에 있던 div)
const ThumbContainer = styled.div`
  flex-shrink: 0;
  margin-top: 0.25rem;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;