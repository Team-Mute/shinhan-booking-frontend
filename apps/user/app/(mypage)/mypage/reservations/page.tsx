"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
// 컴포넌트 경로 수정이 필요한 경우 프로젝트에 맞게 변경
import MySideBar from "../components/sideBar";
import closeIcon from "@user/svg-icons/close.svg";
import { useRouter } from "next/navigation";
import ReservationInfoModal from "../components/ReservationInfoModal";
import Loader from "@user/components/Loader";
import Pagination from "@components/ui/pagination/Pagination";
import { useReservations } from "./hooks/useReservations";

const TABS = ["전체", "진행중", "예약완료", "이용완료", "취소"];

export default function MyPageReservations() {
  const router = useRouter();
  const {
    activeTab,
    setActiveTab, // 훅에서 페이지 리셋 로직 포함
    searchTerm,
    setSearchTerm, // 훅에서 페이지 리셋 로직 포함
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedReservations,
    isLoading, // 훅에서 추가된 로딩 상태
  } = useReservations(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [selectedReservationStatus, setSelectedReservationStatus] =
    useState<string>("");

  const handleOpenModal = (reservationId: number, status: string) => {
    setSelectedReservationId(reservationId);
    setSelectedReservationStatus(status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservationId(null);
    setSelectedReservationStatus("");
  };

  const handleLocationClick = (spaceId: number) => {
    router.push(`/spaces/${spaceId}`);
  };

  /** 페이지 그룹 계산 */
  const pageGroupSize = 5;
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const handlePrevGroup = () => {
    if (startPage > 1) setCurrentPage(startPage - 1);
  };
  const handleNextGroup = () => {
    if (endPage < totalPages) setCurrentPage(endPage + 1);
  };

  return (
    <Container>
      <Loader>
        <MySideBar />
        <Wrapper>
          <ModalHeader>
            <Title>공간예약 내역</Title>
            <CloseButton onClick={() => router.push("/mypage")}>
              <CloseIcon />
            </CloseButton>
          </ModalHeader>

          <TabsContainer>
            {TABS.map((tab) => (
              <TabItem
                key={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </TabItem>
            ))}
          </TabsContainer>

          <SearchContainer>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#8C8F93"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="#8C8F93"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="예약번호로 찾기"
            />
          </SearchContainer>

          <ReservationList>
            {paginatedReservations.length === 0 && !isLoading ? (
              <EmptyState>예약 내역이 없습니다.</EmptyState>
            ) : (
              paginatedReservations.map((reservation) => (
                <ReservationItem key={reservation.id}>
                  <ItemContent>
                    <InfoSection>
                      <InfoTop>
                        <StatusBadge status={reservation.status}>
                          {reservation.status}
                        </StatusBadge>
                        <ReservationNumber>
                          예약번호: {reservation.id}
                        </ReservationNumber>
                      </InfoTop>
                      <Location
                        onClick={() => handleLocationClick(reservation.spaceId)}
                      >
                        {reservation.location}
                      </Location>
                      <Schedule>
                        <DateTime>
                          <span>{reservation.mainDate}</span>
                          <Separator />
                          <span>{reservation.mainTime}</span>
                        </DateTime>
                        {reservation.preVisitDate && (
                          <SubDateTime>
                            <span>사전답사 {reservation.preVisitDate}</span>
                            <Separator isSubtle />
                            <span>{reservation.preVisitTime}</span>
                          </SubDateTime>
                        )}
                      </Schedule>
                    </InfoSection>
                    <DetailsButton
                      onClick={() =>
                        handleOpenModal(
                          reservation.reservationId,
                          reservation.status
                        )
                      }
                    >
                      상세보기
                    </DetailsButton>
                  </ItemContent>
                </ReservationItem>
              ))
            )}
          </ReservationList>

          <ReservationInfoModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            reservationId={selectedReservationId}
            status={selectedReservationStatus}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              startPage={startPage}
              endPage={endPage}
              onPageChange={setCurrentPage}
              onPrevGroup={handlePrevGroup}
              onNextGroup={handleNextGroup}
            />
          )}
        </Wrapper>
      </Loader>
    </Container>
  );
}

// --- 스타일 컴포넌트 (이하 동일) ---
const CloseIcon = styled(closeIcon)``;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 0 81px; // 좌우 여백 81px
  font-family: "Pretendard", sans-serif;

  @media (max-width: 768px) {
    padding: 20px; // 모바일은 전체 패딩
  }
`;
const ModalHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
`;
const Title = styled.h1`
  font-weight: 600;
  font-size: 20px;
  color: #191f28;
  margin: 0;
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
const TabsContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  @media (max-width: 768px) {
    overflow-x: auto;
    padding-bottom: 8px;
    gap: 8px;
  }
`;
const TabItem = styled.button<{ isActive: boolean }>`
  padding: 8px;
  background: none;
  border: none;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  color: ${(props) => (props.isActive ? "#191F28" : "#8C8F93")};
  border-bottom-color: ${(props) =>
    props.isActive ? "#191F28" : "transparent"};
  white-space: nowrap;
  &:hover {
    color: #191f28;
  }
`;
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
  width: 100%;
  height: 48px;
  background: #f3f4f4;
  border-radius: 12px;
  box-sizing: border-box;
`;
const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #191f28;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #8c8f93;
  }
`;
const ReservationList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  min-height: calc(100vh - 260px);
  @media (min-width: 769px) {
    height: 400px;
    overflow-y: auto;
  }
  @media (max-width: 768px) {
    flex: 1;
    overflow-y: auto;
  }
`;
const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #8c8f93;
  font-size: 16px;
`;
const ReservationItem = styled.div`
  box-sizing: border-box;
  width: 100%;
  border-bottom: 1px solid #e8e9e9;
  padding: 16px 0px;
`;
const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const InfoTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;
const statusStyles = {
  진행중: { bg: "#FFF7E8", color: "#FDB01F" },
  예약완료: { bg: "#F2FBF8", color: "#34C759" },
  이용완료: { bg: "#F0F1F5", color: "#8496C5" },
  취소: { bg: "#F3F4F4", color: "#8E8E93" },
  반려: { bg: "#FCF2FF", color: "#C800FF" },
};
const StatusBadge = styled.div<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 11px;
  background-color: ${(props) => statusStyles[props.status]?.bg || "#F3F4F4"};
  color: ${(props) => statusStyles[props.status]?.color || "#52555B"};
`;
const ReservationNumber = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: #8c8f93;
`;
const Location = styled.h2`
  font-weight: 600;
  font-size: 16px;
  color: #191f28;
  margin: 0;
  cursor: pointer;
`;
const Schedule = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const DateTime = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 12px;
  color: #191f28;
  flex-wrap: wrap;
`;
const SubDateTime = styled(DateTime)`
  font-weight: 500;
  color: #8c8f93;
`;
const Separator = styled.div<{ isSubtle?: boolean }>`
  width: 1px;
  height: 12px;
  background-color: ${(props) => (props.isSubtle ? "#E8E9E9" : "#191F28")};
`;
const DetailsButton = styled.button`
  padding: 8px 12px;
  background: #f2f6ff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  color: #0046ff;
  height: 30px;
  @media (max-width: 768px) {
    width: 100%;
    height: 40px;
  }
`;
