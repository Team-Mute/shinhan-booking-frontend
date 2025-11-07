"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { DashBoardCard, ReservationStatus, ProcessedReservation } from "@admin/types/dashBoardAdmin";
import {
  getDashboardCardApi,
  getDashboardReservationsApi,
} from "@admin/lib/api/adminDashboard";
import CalendarSettingModal from "../dashboard/components/CalendarSettingModal";
import CalendarHeader from "../dashboard/components/CalendarHeader";
import CalendarGrid from "../dashboard/components/CalendarGrid";
import { useLocalStorage } from "../dashboard/hooks/useCalendarSetting";
import {
  STATUS_COLORS,
  STATUS_ID_TO_API_ID,
  STATUS_LABEL_TO_KEY,
  STORAGE_KEYS,
  DEFAULT_VISIBLE_STATUSES,
} from "@admin/lib/constants/dashboard";
import { processApiData } from "@admin/lib/utils/dashboardUtils";

/**
 * 대시보드 메인 페이지
 * - 예약 현황 카드
 * - 월별 캘린더
 * - 캘린더 설정
 */
export default function Dashboard() {
  const router = useRouter();

  // State 관리
  const [cardData, setCardData] = useState<DashBoardCard[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<ProcessedReservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // localStorage를 통한 캘린더 설정 저장
  const [visibleStatuses, setVisibleStatuses] = useLocalStorage<string[]>(
    STORAGE_KEYS.VISIBLE_STATUSES,
    DEFAULT_VISIBLE_STATUSES
  );

  /**
   * 예약 목록 로드
   * - 현재 월과 표시 상태에 따라 필터링
   */
  useEffect(() => {
    const loadReservations = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      // 선택된 상태 ID를 API ID로 변환
      const statusIds = visibleStatuses.map(
        (statusId) => STATUS_ID_TO_API_ID[statusId]
      );

      try {
        const rawData = await getDashboardReservationsApi(year, month, statusIds);
        const processedData = processApiData(rawData);
        setReservations(processedData);
      } catch (err) {
        console.error("예약 목록을 불러오는 데 실패했습니다:", err);
        setReservations([]);
      }
    };

    loadReservations();
  }, [currentDate, visibleStatuses]);

  /**
   * 대시보드 카드 데이터 로드
   */
  useEffect(() => {
    const loadDashboardCard = async () => {
      try {
        const response = await getDashboardCardApi();
        setCardData(response);
      } catch (err) {
        console.error("대시보드 카드 데이터를 불러오는 데 실패했습니다:", err);
        setCardData([]);
      }
    };

    loadDashboardCard();
  }, []);

  /**
   * 예약 현황 카드 클릭 핸들러
   * - 해당 상태로 필터링된 예약관리 페이지로 이동
   */
  const handleStatusCardClick = (status: ReservationStatus) => {
    // "긴급"과 "신한"은 플래그 필터
    if (status === "긴급") {
      router.push(`/reservation?isEmergency=true`);
    } else if (status === "신한") {
      router.push(`/reservation?isShinhan=true`);
    } else {
      // 일반 상태는 statusId로 필터
      const statusKey = STATUS_LABEL_TO_KEY[status as keyof typeof STATUS_LABEL_TO_KEY];
      if (statusKey) {
        const statusId = STATUS_ID_TO_API_ID[statusKey];
        router.push(`/reservation?statusId=${statusId}`);
      }
    }
  };

  /**
   * 캘린더 설정 저장 핸들러
   * - localStorage에 자동 저장됨
   */
  const handleSaveSettings = (selectedStatuses: string[]) => {
    setVisibleStatuses(selectedStatuses);
    console.log("캘린더 설정 저장:", selectedStatuses);
  };

  return (
    <DashboardContainer>
      <Title>대시보드</Title>

      {/* 예약 현황 카드 영역 */}
      <SummaryContainer>
        {cardData.map((item) => (
          <StyledCard
            key={item.label}
            onClick={() => handleStatusCardClick(item.label as ReservationStatus)}
          >
            <Badge status={item.label as ReservationStatus}>
              {item.label}
            </Badge>
            <Count>{item.count}건</Count>
          </StyledCard>
        ))}
      </SummaryContainer>

      {/* 캘린더 영역 */}
      <CalendarSection>
        <CalendarHeader
          date={currentDate}
          setDate={setCurrentDate}
          onSettingsClick={() => setIsModalOpen(true)}
          visibleStatuses={visibleStatuses}
        />
        <CalendarGrid
          date={currentDate}
          reservations={reservations}
          visibleStatuses={visibleStatuses}
        />
      </CalendarSection>

      {/* 캘린더 설정 모달 */}
      <CalendarSettingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSettings}
        initialSelectedStatuses={visibleStatuses}
      />
    </DashboardContainer>
  );
}

// Styled Components
const DashboardContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: "Pretendard", sans-serif;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
`;

const SummaryContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const StyledCard = styled.div`
  text-decoration: none;
  color: inherit;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 200px;
  background: #ffffff;
  border: 1px solid #e8e9e9;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const Badge = styled.div<{ status: ReservationStatus }>`
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  width: fit-content;
  background-color: ${({ status }) => {
    if (status === "1차 승인 대기") return "#FFFCF2";
    if (status === "2차 승인 대기") return "#FFF8F2";
    if (status === "긴급") return "#FFF2F2";
    if (status === "신한") return "#F2F6FF";
    return "#F3F4F4";
  }};
  color: ${({ status }) => STATUS_COLORS[status]};
`;

const Count = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: #191f28;
  margin: 0;
`;

const CalendarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;