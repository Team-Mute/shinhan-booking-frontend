"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import MySideBar from "../components/sideBar";
import closeIcon from "@user/svg-icons/close.svg";
import { useRouter } from "next/navigation";
import { getReservationListApi } from "@user/lib/api/reservation";
import ReservationInfoModal from "../components/ReservationInfoModal";
import Loader from "@user/components/Loader";

// --- API 응답을 위한 타입 정의 ---
interface Previsit {
  previsitId: number;
  previsitFrom: string;
  previsitTo: string;
}

interface ApiResponseReservation {
  reservationId: number;
  reservationStatusName: "진행중" | "예약완료" | "이용완료" | "취소" | "반려";
  orderId: string;
  spaceId: number;
  spaceName: string;
  reservationFrom: string;
  reservationTo: string;
  previsits: Previsit[];
}

// --- UI에서 사용할 타입 정의 ---
interface Reservation {
  reservationId: number;
  id: string; // orderId
  status: "진행중" | "예약완료" | "이용완료" | "취소" | "반려";
  spaceId: number;
  location: string; // spaceName
  mainDate: string;
  mainTime: string;
  preVisitDate?: string;
  preVisitTime?: string;
}

interface TabItemProps {
  isActive: boolean;
}

interface StatusBadgeProps {
  status: Reservation["status"];
}

// --- 유틸리티 함수 ---
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const formattedDate = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  const formattedTime = `${hours}:${minutes}`;

  return { formattedDate, formattedTime };
};

const mapApiDataToReservation = (
  apiData: ApiResponseReservation
): Reservation => {
  const { formattedDate: mainDate, formattedTime: fromTime } = formatDateTime(
    apiData.reservationFrom
  );
  const { formattedTime: toTime } = formatDateTime(apiData.reservationTo);

  let preVisitInfo: { preVisitDate?: string; preVisitTime?: string } = {};
  if (apiData.previsits && apiData.previsits.length > 0) {
    const previsit = apiData.previsits[0];
    const { formattedDate: preDate, formattedTime: preFromTime } =
      formatDateTime(previsit.previsitFrom);
    const { formattedTime: preToTime } = formatDateTime(previsit.previsitTo);
    preVisitInfo = {
      preVisitDate: preDate,
      preVisitTime: `${preFromTime} ~ ${preToTime}`,
    };
  }

  // API의 '이용완료'를 UI의 '완료'로 매핑
  const uiStatus = apiData.reservationStatusName;

  return {
    reservationId: apiData.reservationId,
    id: apiData.orderId,
    status: uiStatus,
    spaceId: apiData.spaceId,
    location: apiData.spaceName,
    mainDate: mainDate,
    mainTime: `${fromTime} ~ ${toTime}`,
    ...preVisitInfo,
  };
};

// --- 상수 정의 ---
const TABS = ["전체", "진행중", "예약완료", "이용완료", "취소"];

// UI 탭 이름을 API 필터 옵션으로 매핑
const TAB_TO_API_FILTER: { [key: string]: string } = {
  전체: "",
  진행중: "진행중",
  예약완료: "예약완료",
  이용완료: "이용완료",
  취소: "취소",
};

// --- 컴포넌트 ---
export default function MyPageReservations() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("전체");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [selectedReservationStatus, setSelectedReservationStatus] =
    useState<string>("");

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const filterOption = TAB_TO_API_FILTER[activeTab];
        const response = await getReservationListApi(filterOption);

        if (response && response.content) {
          const mappedData = response.content.map(mapApiDataToReservation);
          setReservations(mappedData);
        } else {
          setReservations([]);
        }
      } catch (error) {
        console.error("예약 목록을 불러오는 데 실패했습니다:", error);
        setReservations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [activeTab]);

  const filteredReservations = reservations.filter((reservation) =>
    reservation.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (reservationId: number, status: string) => {
    setSelectedReservationId(reservationId);
    setSelectedReservationStatus(status);
    setIsModalOpen(true);
  };

  const handleCloseModal = (isChanged?: boolean) => {
    setIsModalOpen(false);
    setSelectedReservationId(null);
    setSelectedReservationStatus("");

    if (isChanged) {
      setActiveTab("취소");
    }
  };

  // 공간 상세 페이지 이동
  const handleLocationClick = (spaceId) => {
    router.push(`/spaces/${spaceId}`);
  };

  const renderContent = () => {
    if (filteredReservations.length === 0) {
      return <EmptyState>예약 내역이 없습니다.</EmptyState>;
    }
    return filteredReservations.map((reservation) => (
      <ReservationItem key={reservation.id}>
        <ItemContent>
          <InfoSection>
            <InfoTop>
              <StatusBadge status={reservation.status}>
                {reservation.status}
              </StatusBadge>
              <ReservationNumber>예약번호: {reservation.id}</ReservationNumber>
            </InfoTop>
              <Location onClick={() => handleLocationClick(reservation.spaceId)}>
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
              handleOpenModal(reservation.reservationId, reservation.status)
            }
          >
            상세보기
          </DetailsButton>
        </ItemContent>
      </ReservationItem>
    ));
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
              type="text"
              placeholder="예약번호로 찾기"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          <ReservationList>{renderContent()}</ReservationList>
          <ReservationInfoModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            reservationId={selectedReservationId}
            status={selectedReservationStatus}
          />
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
  padding-right: 81px;
  font-family: "Pretendard", sans-serif;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    padding: 20px;
    box-sizing: border-box;
    gap: 16px;
    z-index: 100;
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

const TabItem = styled.button<TabItemProps>`
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
  반려: { bg: "#FCF2FF", color: "#C800FF" }, // 새로 추가된 반려 스타일
};

const StatusBadge = styled.div<StatusBadgeProps>`
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
