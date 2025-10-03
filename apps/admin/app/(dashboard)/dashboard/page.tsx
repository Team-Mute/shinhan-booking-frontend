"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { DashBoardCard } from "../../../types/dashBoardAdmin";
import {
  getDashboardCardApi,
  getDashboardReservationsApi,
} from "../../../lib/api/adminDashboard";
import {
  RawReservationData,
  ReservationStatus,
  ProcessedReservation,
} from "../../../types/dashBoardAdmin";
import Link from "next/link";

const statusColors: Record<ReservationStatus, string> = {
  "1차 승인 대기": "#FFBB00",
  "2차 승인 대기": "#FF7300",
  "최종 승인 완료": "#34C759",
  "이용 완료": "#8496C5",
  긴급: "#FF0000",
  신한: "#0046FF",
};

const CalendarHeader = ({
  date,
  setDate,
}: {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const changeMonth = (amount: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + amount);
    setDate(newDate);
  };

  const legendStatus = Object.entries(statusColors).filter(
    ([status]) => status !== "긴급" && status !== "신한"
  );

  return (
    <HeaderWrapper>
      <TopRow>
        <MonthNavigator>
          <button onClick={() => changeMonth(-1)}>
            <IoIosArrowBack size={20} />
          </button>
          <span>
            {date.getFullYear()}, {date.getMonth() + 1}월
          </span>
          <button onClick={() => changeMonth(1)}>
            <IoIosArrowForward size={20} />
          </button>
        </MonthNavigator>
        <SettingsButton>
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.68293 0.588116C9.19836 0.175506 8.57665 -0.00541516 7.9842 0.000123232C7.39266 0.00658469 6.77735 0.200429 6.29736 0.611193C5.80365 1.03396 5.48639 1.6598 5.48639 2.43609C5.48639 2.79978 5.25234 3.18193 4.85188 3.42193C4.45417 3.66008 4.02263 3.68039 3.7063 3.49393L3.68618 3.48193C3.00687 3.1127 2.31476 3.06839 1.70677 3.29362C1.11432 3.51331 0.660837 3.96377 0.381068 4.48438C-0.169327 5.51175 -0.118128 7.02373 1.1582 7.89234L1.19569 7.91634C1.48643 8.0871 1.69488 8.48125 1.6958 8.97786C1.6958 9.47355 1.48551 9.8677 1.19569 10.0385L1.18655 10.0449C0.528266 10.4474 0.149755 11.0372 0.0363849 11.6815C-0.0733284 12.3083 0.0729561 12.9387 0.369182 13.4538C0.665408 13.9689 1.1326 14.4092 1.72048 14.6289C2.32391 14.8541 3.0151 14.8292 3.68618 14.4646L3.7063 14.4526C4.05738 14.2458 4.47246 14.2873 4.85097 14.5504C5.2432 14.8209 5.48639 15.2593 5.48639 15.6599C5.48639 16.4298 5.81005 17.0418 6.31381 17.4461C6.79838 17.8347 7.4146 18.0045 7.99609 17.9999C8.57757 17.9953 9.19013 17.8162 9.67013 17.4276C10.1675 17.027 10.4966 16.4215 10.4966 15.6599C10.4966 15.239 10.7407 14.7996 11.1229 14.5347C11.4905 14.28 11.9055 14.2347 12.2758 14.4526L12.2968 14.4636C12.9826 14.8375 13.6865 14.8587 14.2973 14.6206C14.8897 14.388 15.3551 13.931 15.6449 13.4077C15.9338 12.8852 16.0765 12.2474 15.9585 11.6234C15.8378 10.9828 15.4502 10.4031 14.7791 10.0338C14.4929 9.86031 14.2863 9.46801 14.2863 8.97232C14.2863 8.47387 14.4966 8.0788 14.7864 7.90803L14.7956 7.90157C15.4548 7.49819 15.8333 6.90927 15.9466 6.26497C16.0564 5.63821 15.9092 5.00776 15.6129 4.49268C15.3176 3.97854 14.8495 3.53731 14.2625 3.31762C13.6591 3.09239 12.967 3.11732 12.2968 3.48193L12.2758 3.49393C11.9768 3.66931 11.5444 3.65454 11.1375 3.4127C10.7307 3.17085 10.4975 2.79055 10.4966 2.43609C10.4966 1.6478 10.1849 1.01365 9.68293 0.588116ZM5.02834 9.00002C5.02834 8.20438 5.3414 7.44132 5.89864 6.87872C6.45589 6.31612 7.21168 6.00005 7.99974 6.00005C8.78781 6.00005 9.54359 6.31612 10.1008 6.87872C10.6581 7.44132 10.9711 8.20438 10.9711 9.00002C10.9711 9.79566 10.6581 10.5587 10.1008 11.1213C9.54359 11.6839 8.78781 12 7.99974 12C7.21168 12 6.45589 11.6839 5.89864 11.1213C5.3414 10.5587 5.02834 9.79566 5.02834 9.00002Z"
              fill="#BABCBE"
            />
          </svg>
        </SettingsButton>
      </TopRow>
      <Legend>
        {legendStatus.map(([status, color]) => (
          <LegendItem key={status}>
            <Dot color={color as string} />
            <span>{status}</span>
          </LegendItem>
        ))}
      </Legend>
    </HeaderWrapper>
  );
};

const CalendarGrid = ({
  date,
  reservations,
}: {
  date: Date;
  reservations: ProcessedReservation[];
}) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 캘린더 날짜를 계산하고 `calendarDays`를 정의하는 부분
  // 이 코드가 return 문 위에 있어야 합니다.
  const calendarDays: (number | null)[] = Array(firstDayOfMonth).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }
  return (
    <GridWrapper>
      {/* ... 캘린더 헤더 (요일) */}
      <GridBody>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <DayCell key={`empty-${index}`} />;
          }

          // 해당 날짜에 대한 예약 목록 필터링
          const fullDateStr = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          const dayReservations = reservations.filter(
            (r) => r.date === fullDateStr
          );

          const dayOfWeek = new Date(year, month, day).getDay();

          return (
            <DayCell key={day}>
              <DayLabel isSunday={dayOfWeek === 0} isSaturday={dayOfWeek === 6}>
                {day}
              </DayLabel>
              <ReservationsContainer>
                {dayReservations.map((res) => (
                  <ReservationItem key={res.id}>
                    <Dot color={statusColors[res.status]} />
                    <span>{res.time}</span>
                    <span>{res.user}</span>
                  </ReservationItem>
                ))}
              </ReservationsContainer>
            </DayCell>
          );
        })}
      </GridBody>
    </GridWrapper>
  );
};

// 불필요한 useMediaQuery 훅을 삭제하고 Dashboard 컴포넌트를 정리
export default function Dashboard() {
  const [cardData, setCardData] = useState<DashBoardCard[]>([]);

  // 캘린더의 현재 날짜를 관리하는 상태
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1));
  // 가공된 예약 데이터를 저장하는 상태
  const [reservations, setReservations] = useState<ProcessedReservation[]>([]);

  useEffect(() => {
    const loadReservations = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      try {
        // API 호출 (별도 파일에 있는 함수 사용)
        const rawData: RawReservationData[] =
          await getDashboardReservationsApi();
        // API 응답 데이터를 캘린더에 맞게 가공
        const processedData = processApiData(rawData);
        setReservations(processedData);
      } catch (err) {
        console.error("예약 목록을 불러오는 데 실패했습니다:", err);
        setReservations([]);
      }
    };

    loadReservations();
  }, [currentDate]); // currentDate가 변경될 때마다 API 호출

  // API 호출 로직을 useEffect로 옮겨서 컴포넌트 마운트 시 한 번만 실행되도록 합니다.
  useEffect(() => {
    const loadDashboardCard = async () => {
      try {
        const response = await getDashboardCardApi();
        // API 응답을 cardData 상태에 저장합니다.
        setCardData(response);
      } catch (err) {
        console.error("대시보드 카드 데이터를 불러오는 데 실패했습니다:", err);
        // 에러 발생 시 처리 (예: 빈 배열로 상태 설정)
        setCardData([]);
      }
    };
    loadDashboardCard();
  }, []); // 빈 의존성 배열로 컴포넌트가 처음 마운트될 때만 실행

  return (
    <DashboardContainer>
      <Title>대시보드</Title>
      <SummaryContainer>
        {/* SummaryCard를 Link 컴포넌트로 감싸고, href 속성으로 이동할 경로를 지정합니다. */}
        {cardData.map((item) => (
          <StyledLink href="/admin/reservation" key={item.label}>
            <Badge status={item.label as ReservationStatus}>{item.label}</Badge>
            <Count>{item.count}건</Count>
          </StyledLink>
        ))}
      </SummaryContainer>
      <CalendarSection>
        {/* 월 변경 핸들러는 CalendarHeader에서 관리 */}
        <CalendarHeader date={currentDate} setDate={setCurrentDate} />
        {/* 가공된 reservations 데이터를 CalendarGrid에 전달 */}
        <CalendarGrid date={currentDate} reservations={reservations} />
      </CalendarSection>
    </DashboardContainer>
  );
}

// API 응답을 캘린더에 표시할 데이터로 변환하는 함수
const processApiData = (
  rawData: RawReservationData[]
): ProcessedReservation[] => {
  return rawData.map((item) => {
    const fromDate = new Date(item.reservationFrom);
    const toDate = new Date(item.reservationTo);

    // YYYY-MM-DD 형식의 날짜 추출
    const date = fromDate.toISOString().split("T")[0];

    // HH:mm 형식의 시간 추출
    const fromTime = `${String(fromDate.getHours()).padStart(2, "0")}:${String(
      fromDate.getMinutes()
    ).padStart(2, "0")}`;
    const toTime = `${String(toDate.getHours()).padStart(2, "0")}:${String(
      toDate.getMinutes()
    ).padStart(2, "0")}`;
    const time = `${fromTime} ~ ${toTime}`;

    // 상태명 매핑 및 긴급/신한 여부 추가 (우선순위: 긴급 > 신한)
    let status = item.reservationStatusName as ReservationStatus;

    return {
      id: item.reservationId,
      date: date,
      time: time,
      user: item.userName,
      status: status,
    };
  });
};

// --- Styled Components (기존 코드 그대로 유지) ---
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

const GridHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #ffffff;
`;

const ReservationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  min-width: 0;
`;

const ReservationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;

  span {
    color: #191f28;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const GridWrapper = styled.div`
  border: 1px solid #e8e9e9;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

const TodayLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #191f28;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

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
`;
const CardContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e8e9e9;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
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
  color: ${({ status }) => statusColors[status]};
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
const MonthNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
`;
const Legend = styled.div`
  display: flex;
  gap: 16px;
`;
const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;
const Dot = styled.div<{ color: string }>`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;
const StyledLink = styled(Link)`
  text-decoration: none; // 기본 밑줄 제거
  color: inherit; // 글씨 색상 상속
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  // SummaryCard의 스타일을 그대로 가져옵니다.
  background: #ffffff;
  border: 1px solid #e8e9e9;
  border-radius: 12px;
  padding: 16px;

  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;
