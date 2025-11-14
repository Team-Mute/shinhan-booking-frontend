// ReservationCalendar.tsx (최종 수정)
"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ReservCalendarProps {
  selectsRange?: boolean;
  onSelectDate: (result: { single?: string; range?: [string, string] }) => void;
  selectedStart?: Date | null;
  selectedEnd?: Date | null;
  onMonthChange?: (year: number, month: number) => void;
  availableDays?: number[];
}

/**
 * ReservationCalendar 컴포넌트
 * ----------------------------
 * - 단일 날짜 또는 기간 선택 가능
 * - 월별 달력 UI 제공
 * - 오늘, 선택, 비활성 날짜 표시
 *
 * Props:
 * - selectsRange: 기간 선택 여부 (기본 true)
 * - onSelectDate: 날짜 선택 이벤트
 * - selectedStart / selectedEnd: 외부에서 선택 상태 제어
 * - onMonthChange: 월 변경 이벤트
 * - availableDays: 선택 가능한 날짜 배열
 */
export default function ReservationCalendar({
  selectsRange = true,
  onSelectDate,
  selectedStart: externalStart,
  selectedEnd: externalEnd,
  onMonthChange,
  availableDays,
}: ReservCalendarProps) {
  // 오늘 날짜를 UTC 0시로 통일
  const getUTCTodayZero = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    return new Date(Date.UTC(y, m, d)); // UTC 0시 0분 0초
  };

  const todayZero = getUTCTodayZero();
  const today = new Date(); // 실제 오늘 날짜

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // 월 변경 시 onMonthChange 호출
  useEffect(() => {
    if (onMonthChange) {
      onMonthChange(currentYear, currentMonth + 1);
    }
  }, [currentYear, currentMonth, onMonthChange]);

  // 외부 시작일이 있을 경우, 해당 월로 이동 (최초 로드 시)
  useEffect(() => {
    if (externalStart && externalStart instanceof Date && isInitialLoad) {
      setCurrentYear(externalStart.getFullYear());
      setCurrentMonth(externalStart.getMonth());
      setIsInitialLoad(false);
    }
  }, [externalStart]);

  /**
   * @description 이전/다음 달 이동
   */
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  /**
   * @description 특정 월의 날짜 배열을 계산
   */
  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) daysArray.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      daysArray.push(new Date(year, month, d));
    return daysArray;
  };

  const days = getDaysInMonth(currentYear, currentMonth);

  // 두 날짜가 같은지 비교 (년/월/일 기준)
  const isSameDay = (
    a: Date | null | undefined,
    b: Date | null | undefined
  ) => {
    if (!a || !b) return false;

    const dateA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const dateB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return dateA === dateB;
  };

  // 선택된 기간 내 날짜인지 확인
  const isInRange = (date: Date) => {
    if (!externalStart || !externalEnd) return false;

    const startT = Date.UTC(
      externalStart.getFullYear(),
      externalStart.getMonth(),
      externalStart.getDate()
    );
    const endT = Date.UTC(
      externalEnd.getFullYear(),
      externalEnd.getMonth(),
      externalEnd.getDate()
    );
    const currentT = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    return currentT > startT && currentT < endT;
  };

  // 날짜 클릭 이벤트를 처리하고 부모 컴포넌트에 결과를 전달 (기간 선택 로직 반영)
  const handleSelect = (date: Date, isAvailable: boolean) => {
    const dateUTC = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayZeroUTC = todayZero.getTime();

    if (dateUTC < todayZeroUTC || !isAvailable) return;

    // --- 단일 선택 모드 (selectsRange=false) ---
    if (!selectsRange) {
      // 단일 선택 모드
      onSelectDate({ single: formatDate(date) });
      return;
    }
    // --- 기간 선택 로직 시작 (selectsRange=true) ---

    // 1. 선택된 날짜가 없거나 (새로운 기간 선택 시작)
    // 2. 이미 기간이 완성된 경우 (externalEnd가 존재)
    if (!externalStart || externalEnd) {
      // 첫 클릭으로 간주하고, '단일' 선택으로 부모에 전달
      // -> SpaceDetailPage에서 이 'single' 결과로 start: 선택일, end: null로 설정될 것입니다.
      onSelectDate({ single: formatDate(date) });
      return;
    }

    // 시작일만 선택된 경우, 두 번째 클릭
    if (externalStart && !externalEnd) {
      const startUTC = Date.UTC(
        externalStart.getFullYear(),
        externalStart.getMonth(),
        externalStart.getDate()
      );
      const dateUTC = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      if (dateUTC < startUTC) {
        onSelectDate({ range: [formatDate(date), formatDate(externalStart)] });
      } else {
        onSelectDate({ range: [formatDate(externalStart), formatDate(date)] });
      }
    }
  };

  /**
   * @description Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환
   */
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return (
    <CalendarContainer>
      {/* 헤더: 월/년 표시 + 이전/다음 버튼 */}

      <Header>
        <Arrow onClick={handlePrevMonth}>
          <IoIosArrowBack size={20} />
        </Arrow>
        <MonthLabel>
          {currentYear}, {String(currentMonth + 1).padStart(2, "0")}월
        </MonthLabel>
        <Arrow onClick={handleNextMonth}>
          <IoIosArrowForward size={20} />
        </Arrow>
      </Header>
      {/* 요일 표시 */}
      <Weekdays>
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <Weekday key={d} isSunday={i === 0} isSaturday={i === 6}>
            {d}
          </Weekday>
        ))}
      </Weekdays>
      {/* 날짜 그리드 */}
      <Grid>
        {days.map((dt, idx) => {
          if (!dt) return <Empty key={idx} />;

          const isBeforeToday =
            Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()) <
            todayZero.getTime();

          const isAvailable = !!availableDays?.includes(dt.getDate());
          const dayIndex = dt.getDay();
          const isSunday = dayIndex === 0;
          const isSaturday = dayIndex === 6;
          const isTodayCheck = isSameDay(dt, today);
          const isSelected = !!(
            isSameDay(dt, externalStart) || isSameDay(dt, externalEnd)
          );

          // selectsRange가 true이고, 시작일/종료일이 모두 있어야 기간 계산
          const inRange = !!(
            selectsRange &&
            externalStart &&
            externalEnd &&
            isInRange(dt)
          );

          const isTrulyDisabled = isBeforeToday || !isAvailable;

          return (
            <Day
              key={idx}
              onClick={() => handleSelect(dt, isAvailable)}
              isToday={isTodayCheck}
              isSelected={isSelected}
              inRange={inRange}
              isSunday={isSunday}
              isSaturday={isSaturday}
              isPast={isTrulyDisabled}
              isAvailable={isAvailable}
            >
              {dt.getDate()}
            </Day>
          );
        })}
      </Grid>
      {/* 하단 정보 박스 */}
      <InfoWrapper>
        <InfoBox>
          <Info color={colors.graycolor20}>
            <div></div>
            <p>오늘</p>
          </Info>
          <Info color={colors.maincolor}>
            <div></div>
            <p>선택</p>
          </Info>
        </InfoBox>
      </InfoWrapper>
    </CalendarContainer>
  );
}

// --- styled ---
const CalendarContainer = styled.div`
  width: 100%;
  max-width: 23rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.875rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const MonthLabel = styled.div`
  font-weight: 700;
  font-size: 1rem;
`;

const Arrow = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Weekday = styled.div<{ isSunday?: boolean; isSaturday?: boolean }>`
  padding: 0.25rem 0;
  color: ${({ isSunday, isSaturday }) =>
    isSunday ? "#FF4D4D" : isSaturday ? "#4D7CFF" : colors.graycolor100};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
  text-align: center;
  gap: 0.25rem;
  justify-items: center;
`;

const Empty = styled.div`
  height: 2rem;
`;

const Day = styled.div<{
  isToday: boolean;
  isSelected: boolean;
  inRange: boolean;
  isSunday?: boolean;
  isSaturday?: boolean;
  isPast?: boolean;
  isAvailable?: boolean;
}>`
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 50%;
  cursor: ${({ isPast }) => (isPast ? "not-allowed" : "pointer")};
  opacity: ${({ isPast, isAvailable }) => (isPast || !isAvailable ? 0.4 : 1)};
  color: ${({ isSelected, isSunday, isSaturday }) =>
    isSelected
      ? "white"
      : isSunday
      ? "#FF4D4D"
      : isSaturday
      ? "#4D7CFF"
      : "#222"};

  background: ${({ isSelected, inRange, isToday }) =>
    isSelected
      ? colors.maincolor
      : inRange
      ? colors.maincolor5
      : isToday
      ? colors.graycolor20
      : "transparent"};

  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ isPast, isAvailable }) =>
      isPast || !isAvailable ? "transparent" : colors.graycolor10};
  }
`;

// info box

const InfoWrapper = styled.div`
  margin-top: 0.75rem;
  height: 2.625rem;
  display: flex;
  justify-content: center;
`;

const InfoBox = styled.div`
  display: flex;
  gap: 1rem;
  border-top: 1px solid ${colors.graycolor5};
  width: 22.9rem;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
`;

const Info = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 0.22rem;

  div {
    width: 0.68rem;
    height: 0.68rem;
    border-radius: 50%;
    background-color: ${(props) => props.color};
  }

  p {
    font-size: 0.875rem;
    color: ${colors.graycolor100};
  }
`;
