"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface CalendarProps {
  selectsRange?: boolean;
  onSelectDate: (result: { single?: string; range?: [string, string] }) => void;
  selectedStart?: Date | null;
  selectedEnd?: Date | null;
}

/**
 * CustomCalendar 컴포넌트
 * ----------------------
 * 월별 달력 UI를 제공하며, 단일 날짜 또는 기간을 선택할 수 있는 제어 컴포넌트
 *
 * 1. Header: 월/연도 표시 및 이전/다음 달 이동 화살표
 * 2. Weekdays: 요일 표시
 * 3. Grid: 실제 날짜 그리드
 * 4. InfoWrapper: 오늘 및 선택 날짜 색상 정보 표시
 *
 * @remarks
 * - 날짜 선택 상태(selectedStart, selectedEnd)를 Props로 받아 외부에서 제어
 * - `onSelectDate`를 통해 선택 결과를 부모 컴포넌트로 전달
 */
export default function CustomCalendar({
  selectsRange = false,
  onSelectDate,
  selectedStart: externalStart, // Props를 externalStart로 사용
  selectedEnd: externalEnd, // Props를 externalEnd로 사용
}: CalendarProps) {
  const today = new Date();
  // 캘린더 월/연도 상태는 그대로 유지
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  /**
   * @description 외부에서 시작일이 주어졌을 때, 해당 월로 캘린더를 이동
   */
  useEffect(() => {
    if (externalStart) {
      setCurrentYear(externalStart.getFullYear());
      setCurrentMonth(externalStart.getMonth());
    }
  }, [externalStart]);

  /**
   * @description 이전 달로 이동
   */
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  /**
   * @description 다음 달로 이동
   */
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

    // 이전 달 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) daysArray.push(null);
    // 현재 달 날짜 채우기
    for (let d = 1; d <= daysInMonth; d++)
      daysArray.push(new Date(year, month, d));
    return daysArray;
  };

  const days = getDaysInMonth(currentYear, currentMonth);

  /**
   * @description 두 날짜 객체가 년/월/일 기준으로 같은지 확인
   */
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  /**
   * @description 날짜가 선택된 기간(externalStart ~ externalEnd) 내에 포함되는지 확인
   */
  const isInRange = (date: Date) => {
    // ⭐️ 내부 상태 대신 external props 사용
    if (!externalStart || !externalEnd) return false;

    // 시/분/초를 제외하고 비교하기 위해 00:00:00으로 설정
    const start = new Date(
      externalStart.getFullYear(),
      externalStart.getMonth(),
      externalStart.getDate()
    ).getTime();
    const end = new Date(
      externalEnd.getFullYear(),
      externalEnd.getMonth(),
      externalEnd.getDate()
    ).getTime();
    const t = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    return t >= start && t <= end;
  };

  /**
   * @description 날짜 클릭 이벤트를 처리하고 부모 컴포넌트에 결과를 전달
   */
  const handleSelect = (date: Date) => {
    // 오늘 이전 날짜 클릭 방지 (시간 초기화)
    const todayZero = new Date();
    todayZero.setHours(0, 0, 0, 0);
    if (date < todayZero) return;

    if (!selectsRange) {
      // 단일 선택 모드
      onSelectDate({ single: formatDate(date) });
      return;
    }

    // 기간 선택 모드 (range)
    // 1. 선택된 날짜가 없거나 (externalStart가 null), 이미 기간이 완성된 경우 (externalStart && externalEnd)
    if (!externalStart || (externalStart && externalEnd)) {
      // 첫 클릭으로 간주하고 시작일만 부모에게 single로 전달
      onSelectDate({ single: formatDate(date) });
      return;
    }

    // 2. 시작일만 선택된 경우 (두 번째 클릭)
    if (externalStart && !externalEnd) {
      if (date.getTime() < externalStart.getTime()) {
        // 종료일 < 시작일 → 순서 변경하여 range로 전달
        onSelectDate({ range: [formatDate(date), formatDate(externalStart)] });
      } else {
        // 정상적인 기간 선택 → range로 전달
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

      <Weekdays>
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <Weekday key={d} isSunday={i === 0} isSaturday={i === 6}>
            {d}
          </Weekday>
        ))}
      </Weekdays>

      <Grid>
        {days.map((dt, idx) => {
          if (!dt) return <Empty key={idx} />;
          const isBeforeToday = dt < new Date(new Date().setHours(0, 0, 0, 0));

          const dayIndex = dt.getDay();
          const isSunday = dayIndex === 0;
          const isSaturday = dayIndex === 6;

          const isTodayCheck = isSameDay(dt, today);

          // 선택된 날짜 여부 (외부 props 기준)
          const isSelected = !!(
            (externalStart && isSameDay(dt, externalStart)) ||
            (externalEnd && isSameDay(dt, externalEnd))
          );
          // 기간 내 포함 여부 (외부 props 기준)
          const inRange = !!(
            selectsRange &&
            externalStart &&
            externalEnd &&
            isInRange(dt)
          );

          return (
            <Day
              key={idx}
              onClick={() => handleSelect(dt)}
              isToday={isTodayCheck}
              isSelected={isSelected}
              inRange={inRange}
              isSunday={isSunday}
              isSaturday={isSaturday}
              isPast={isBeforeToday}
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
}>`
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 50%;
  cursor: ${({ isPast }) => (isPast ? "not-allowed" : "pointer")};
  opacity: ${({ isPast }) => (isPast ? 0.4 : 1)};
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
    background: ${({ isPast }) =>
      isPast ? "transparent" : colors.graycolor10};
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
