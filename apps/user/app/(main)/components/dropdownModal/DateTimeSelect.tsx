"use client";

import React from "react";
import styled from "@emotion/styled";
import CustomCalendar from "@components/CustomCalendar";
import SelectBox2 from "@components/ui/selectbox/Selectbox2";

interface DateTimeSelectProps {
  tempStartDate: Date | null;
  tempEndDate: Date | null;
  tempStartTime: string;
  tempEndTime: string;
  showTimePicker: boolean;
  startOptions: { label: string; value: string }[];
  endOptions: { label: string; value: string }[];
  INITIAL_START_LABEL: string;
  INITIAL_END_LABEL: string;
  isRange: boolean;
  onSelectDate: (result: { single?: string; range?: [string, string] }) => void;
  setTempStartTime: (v: string) => void;
  setTempEndTime: (v: string) => void;
}

/**
 * DateTimeSelect 컴포넌트
 * ----------------------------
 * 날짜(CustomCalendar)와 시간(SelectBox2)을 선택하는 컴포넌트
 *
 * 1. DateWrapper : CustomCalendar를 포함하는 날짜 선택 영역
 * 2. CustomCalendar : 날짜 기간 선택 UI (selectsRange={true})
 * 3. TimeWrapper : 시간 선택 UI (SelectBox2) 영역. showTimePicker가 true일 때만 표시됨
 *
 * @remarks
 * - isRange가 true일 경우 (기간 선택 시), 시간 선택기는 비활성화됨
 * - 시간 선택기는 `CustomCalendar`의 `onSelectDate` 호출로 업데이트된 상태를 사용함
 */
export default function DateTimeSelect({
  tempStartDate,
  tempEndDate,
  tempStartTime,
  tempEndTime,
  showTimePicker,
  startOptions,
  endOptions,
  INITIAL_START_LABEL,
  INITIAL_END_LABEL,
  isRange,
  onSelectDate,
  setTempStartTime,
  setTempEndTime,
}: DateTimeSelectProps) {
  return (
    <Container>
      {/* 날짜 선택 섹션 */}
      <DateWrapper>
        <DateTitle>예약 날짜</DateTitle>
        <CustomCalendar
          selectsRange={true}
          onSelectDate={onSelectDate}
          selectedStart={tempStartDate}
          selectedEnd={tempEndDate}
        />
      </DateWrapper>

      {/* 시간 선택 섹션 (날짜 선택 후 활성화) */}
      {showTimePicker && (
        <TimeWrapper>
          <DateTitle>예약 시간</DateTitle>
          <TimePickerWrapper>
            {/* 시작 시간 선택 */}
            <SelectBox2
              options={startOptions}
              value={tempStartTime}
              onChange={(v) => setTempStartTime(v)}
              disabled={isRange}
            />
            <span>~</span>
            {/* 종료 시간 선택 */}
            <SelectBox2
              options={endOptions}
              value={tempEndTime}
              onChange={(v) => setTempEndTime(v)}
              disabled={tempStartTime === INITIAL_START_LABEL || isRange}
            />
          </TimePickerWrapper>
        </TimeWrapper>
      )}
    </Container>
  );
}

// --- styled ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  padding-bottom: 2rem;
`;

const DateTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const TimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
`;

const TimePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
