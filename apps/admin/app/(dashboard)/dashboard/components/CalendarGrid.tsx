import React, { useState } from "react";
import styled from "@emotion/styled";
import { ProcessedReservation, RawReservationData } from "@admin/types/dashBoardAdmin";
import { getDashboardReservationsByDateApi } from "@admin/lib/api/adminDashboard";
import DayDetailModal from "../components/DayDetailModal";
import { STATUS_COLORS, STATUS_ID_TO_LABEL, STATUS_ID_TO_API_ID } from "@admin/lib/constants/dashboard";

interface CalendarGridProps {
  date: Date;
  reservations: ProcessedReservation[];
  visibleStatuses: string[];
}

/**
 * 캘린더 그리드 컴포넌트
 * - 월별 캘린더 표시
 * - 예약 정보 표시
 * - 날짜 클릭 시 상세 모달 오픈
 */
const CalendarGrid: React.FC<CalendarGridProps> = ({
  date,
  reservations,
  visibleStatuses,
}) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 각 날짜별 확장 상태 관리
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  
  // 상세 모달 관련 state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayDetailReservations, setDayDetailReservations] = useState<RawReservationData[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  /**
   * 캘린더 날짜 배열 생성
   * - 첫 주의 빈 칸 (null)
   * - 실제 날짜 (1~마지막 날)
   * - 마지막 주의 빈 칸 (null)
   */
  const calendarDays: (number | null)[] = Array(firstDayOfMonth).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  // 현재 표시중인 상태 레이블 목록
  const visibleLabels = visibleStatuses.map((id) => STATUS_ID_TO_LABEL[id]);

  /**
   * 날짜별 예약 확장/축소 토글
   */
  const toggleExpanded = (dateStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDays((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr],
    }));
  };

  /**
   * 날짜 클릭 핸들러 - 상세 모달 오픈
   * 현재 캘린더에 표시중인 상태만 필터링하여 조회
   */
  const handleDayClick = async (dateStr: string) => {
    try {
      // 현재 표시중인 상태 ID를 API ID로 변환
      const statusIds = visibleStatuses.map(
        (statusId) => STATUS_ID_TO_API_ID[statusId]
      );

      // API 호출 시 날짜와 상태 ID 전달
      const data = await getDashboardReservationsByDateApi(dateStr, statusIds);
      setDayDetailReservations(data);
      setSelectedDate(dateStr);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error("해당 날짜의 예약을 불러오는 데 실패했습니다:", err);
    }
  };

  return (
    <>
      <GridWrapper>
        {/* 요일 헤더 */}
        <GridHeader>
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <DayHeader
              key={day}
              isSunday={index === 0}
              isSaturday={index === 6}
            >
              {day}
            </DayHeader>
          ))}
        </GridHeader>

        {/* 날짜 그리드 */}
        <GridBody>
          {calendarDays.map((day, index) => {
            // 빈 칸
            if (day === null) {
              return <DayCell key={`empty-${index}`} />;
            }

            // 날짜 문자열 생성 (YYYY-MM-DD)
            const fullDateStr = `${year}-${String(month + 1).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;
            
            // 해당 날짜의 예약 필터링
            const dayReservations = reservations.filter(
              (r) => r.dates.includes(fullDateStr) && visibleLabels.includes(r.status)
            );

            const dayOfWeek = new Date(year, month, day).getDay();
            const isExpanded = expandedDays[fullDateStr] || false;
            
            // 확장 상태에 따라 표시할 예약 결정 (기본 3개)
            const displayedReservations = isExpanded 
              ? dayReservations 
              : dayReservations.slice(0, 3);
            
            const remainingCount = dayReservations.length - 3;

            return (
              <DayCell key={day} onClick={() => handleDayClick(fullDateStr)}>
                <DayLabel isSunday={dayOfWeek === 0} isSaturday={dayOfWeek === 6}>
                  {day}
                </DayLabel>
                
                <ReservationsContainer>
                  {/* 예약 목록 */}
                  {displayedReservations.map((res) => {
                    const isCompleted = res.status === "이용 완료";
                    const isCancelled = res.status === "예약 취소";
                    
                    return (
                      <ReservationItem 
                        key={`${res.id}-${fullDateStr}`}
                        isCompleted={isCompleted}
                        isCancelled={isCancelled}
                      >
                        <Dot color={STATUS_COLORS[res.status]} />
                        <span>{res.time}</span>
                        <span>{res.user}</span>
                      </ReservationItem>
                    );
                  })}

                  {/* 더보기/접기 버튼 */}
                  {remainingCount > 0 && !isExpanded && (
                    <MoreButton onClick={(e) => toggleExpanded(fullDateStr, e)}>
                      + {remainingCount} 더보기
                    </MoreButton>
                  )}
                  {isExpanded && dayReservations.length > 3 && (
                    <MoreButton onClick={(e) => toggleExpanded(fullDateStr, e)}>
                      접기
                    </MoreButton>
                  )}
                </ReservationsContainer>
              </DayCell>
            );
          })}
        </GridBody>
      </GridWrapper>

      {/* 날짜 상세 모달 */}
      {isDetailModalOpen && selectedDate && (
        <DayDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          date={selectedDate}
          reservations={dayDetailReservations}
        />
      )}
    </>
  );
};

export default CalendarGrid;

// Styled Components (동일)
const GridWrapper = styled.div`
  border: 1px solid #e8e9e9;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const GridHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #ffffff;
`;

const DayHeader = styled.div<{ isSunday?: boolean; isSaturday?: boolean }>`
  text-align: center;
  padding: 16px 0;
  font-weight: 500;
  font-size: 16px;
  color: ${(props) =>
    props.isSunday ? "#FF3A48" : props.isSaturday ? "#0046FF" : "#191F28"};
  border-bottom: 1px solid #e8e9e9;
  border-right: 1px solid #e8e9e9;

  &:last-of-type {
    border-right: none;
  }
`;

const GridBody = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  & > div {
    border-right: 1px solid #e8e9e9;
    border-top: 1px solid #e8e9e9;
  }

  & > div:nth-of-type(7n) {
    border-right: none;
  }

  & > div:nth-of-type(-n + 7) {
    border-top: none;
  }
`;

const DayCell = styled.div`
  padding: 8px;
  min-height: 105px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const DayLabel = styled.div<{ isSunday?: boolean; isSaturday?: boolean }>`
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${(props) =>
    props.isSunday ? "#FF3A48" : props.isSaturday ? "#0046FF" : "#191F28"};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ReservationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  min-width: 0;
`;

const ReservationItem = styled.div<{ isCompleted?: boolean; isCancelled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${(props) => (props.isCompleted || props.isCancelled) ? '#BABCBE' : '#191f28'};
    text-decoration: ${(props) => (props.isCompleted || props.isCancelled) ? 'line-through' : 'none'};
  }
`;

const Dot = styled.div<{ color: string }>`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  flex-shrink: 0;
`;

const MoreButton = styled.div`
  font-size: 12px;
  color: #191f28;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    text-decoration: underline;
  }
`;