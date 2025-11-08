import React, { useState } from "react";
import { SectionHeader } from "./common";
import styled from "@emotion/styled";
import {
  ClosedDay,
  Operation as OperationType,
} from "@admin/types/dto/space.dto";
import { DAYS, TIME_OPTIONS } from "@admin/lib/constants/space";
import SelectBox2 from "@components/ui/selectbox/Selectbox2";
import { Switch } from "@components/index";
import { GapBox } from "@admin/components/GapBox";
import CalendarModal from "../../CalendarModal";
import colors from "@styles/theme";
import HolidayItem from "../../HolidayItem";

interface OperatingTimeFormProps {
  form: any;
  setForm: (f: any) => void;
}

/**
 * OperatingTimeForm 컴포넌트
 * ----------------------------
 * 공간의 운영 시간 및 휴무일(ClosedDay)을 설정하는 폼 섹션
 * - 요일별 운영 시간 설정
 * - 캘린더 모달을 통한 특정 날짜/기간의 휴무일 등록 및 삭제 기능 제공
 * - 모든 데이터는 form.space.operations 및 form.space.closedDays에 반영
 */
const OperatingTimeForm: React.FC<OperatingTimeFormProps> = ({
  form,
  setForm,
}) => {
  // 캘린더 모달의 열림/닫힘 상태 관리
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  // 캘린더에서 사용자가 선택한 시작일과 종료일(Date 객체)을 임시로 관리하는 상태
  const [selectedDates, setSelectedDates] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  /**
   * 요일별 운영 시간 (from, to, isOpen)을 업데이트하는 함수
   */
  const updateDay = (idx: number, patch: Partial<OperationType>) => {
    const next = [...form.space.operations];
    next[idx] = { ...next[idx], ...patch };

    // 시작/종료 시간 검증
    const [startH, startM] = next[idx].from.split(":").map(Number);
    const [endH, endM] = next[idx].to.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // 시작 시간이 종료 시간보다 크면 종료 시간을 자동으로 시작+30분으로 조정
    if (endMinutes <= startMinutes) {
      const newEndH = Math.floor((startMinutes + 30) / 60);
      const newEndM = (startMinutes + 30) % 60;
      next[idx].to = `${String(newEndH).padStart(2, "0")}:${String(
        newEndM
      ).padStart(2, "0")}`;
    }

    setForm({ ...form, space: { ...form.space, operations: next } });
  };

  /**
   * 캘린더에서 선택된 날짜/기간을 form.space.closedDays에 추가하는 함수
   * @param start - 시작 날짜 ('YYYY-MM-DD' 형식 문자열)
   * @param end - 종료 날짜 ('YYYY-MM-DD' 형식 문자열, 하루 선택 시 undefined)
   */
  const addHoliday = (start: string, end?: string) => {
    const closedDays: ClosedDay[] = form.space.closedDays || [];

    // 서버 API 형식(ISO 8601)에 맞게 시간 정보(00:00:00 / 23:59:59)를 포함하여 ClosedDay 객체 생성
    const newHoliday: ClosedDay = {
      from: `${start}T00:00:00`,
      to: end ? `${end}T23:59:59` : `${start}T23:59:59`, // 하루 선택이면 종료일도 시작일로 설정
    };

    // 중복 추가 방지 로직
    const isDuplicated = closedDays.some(
      (day) => day.from === newHoliday.from && day.to === newHoliday.to
    );

    if (!isDuplicated) {
      const nextClosedDays = [...closedDays, newHoliday];
      setForm({
        ...form,
        space: { ...form.space, closedDays: nextClosedDays },
      });
    }
  };

  /**
   * CalendarModal에서 '휴무일로 등록하기' 버튼 클릭 시 최종적으로 호출되는 핸들러
   * 휴무일을 등록하고 모달을 닫고 캘린더 상태를 초기화하는 역할을 수행
   */
  const handleCalendarSelect = (start: string, end?: string) => {
    addHoliday(start, end); // 휴무일 추가
    setCalendarOpen(false); // 모달 닫기
    setSelectedDates({ start: null, end: null }); // 캘린더 선택 초기화
  };

  /**
   * 등록된 휴무일 항목을 폼 데이터에서 삭제하는 함수
   * @param index - 삭제할 휴무일 항목의 인덱스
   */
  const removeHoliday = (index: number) => {
    // 해당 인덱스를 제외한 새로운 휴무일 배열 생성
    const nextClosedDays = form.space.closedDays.filter((_, i) => i !== index);
    setForm({ ...form, space: { ...form.space, closedDays: nextClosedDays } });
  };

  // 렌더링을 위해 현재 폼 데이터의 휴무일 리스트를 가져옴
  const currentClosedDays: ClosedDay[] = form.space.closedDays || [];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* 1. 운영시간 설정 섹션 헤더 */}
      <SectionHeader>운영시간 설정</SectionHeader>
      {/* 요일별 운영 시간 리스트 렌더링 */}
      {form.space.operations.map((op, i) => {
        const [startH, startM] = op.from.split(":").map(Number);
        const startMinutes = startH * 60 + startM;

        const [endH, endM] = op.to.split(":").map(Number);
        const endMinutes = endH * 60 + endM;

        // 시작 시간 옵션: 종료 시간보다 같거나 이후는 disabled
        const startOptions = TIME_OPTIONS.map((t) => {
          const [h, m] = t.value.split(":").map(Number);
          const minutes = h * 60 + m;
          return {
            ...t,
            disabled: minutes >= endMinutes,
          };
        });

        // 종료 시간 옵션: 시작 시간보다 같거나 이전은 disabled
        const endOptions = TIME_OPTIONS.map((t) => {
          const [h, m] = t.value.split(":").map(Number);
          return { ...t, disabled: h * 60 + m <= startMinutes };
        });

        return (
          <Operation key={DAYS[i]}>
            <h5>{DAYS[i]}</h5>

            {op.isOpen ? (
              // 운영 시: 시간 선택 SelectBox 표시
              <TimeBox>
                <SelectBox2
                  options={startOptions}
                  value={op.from}
                  onChange={(v: string) => updateDay(i, { from: v })}
                  width="6.75rem"
                />
                <h4>~</h4>
                <SelectBox2
                  options={endOptions}
                  value={op.to}
                  onChange={(v: string) => updateDay(i, { to: v })}
                  width="6.75rem"
                />
              </TimeBox>
            ) : (
              // 휴무 시: '휴무일' 텍스트 표시
              <TimeBox>
                <span style={{ color: colors.negativecolor, fontWeight: 500 }}>
                  휴무일
                </span>
              </TimeBox>
            )}

            <SwitchWrapper>
              {/* 운영 여부 (isOpen)를 토글하는 스위치 */}
              <Switch
                initial={op.isOpen}
                onToggle={(checked: boolean) =>
                  updateDay(i, { isOpen: checked })
                }
              />
            </SwitchWrapper>
            <span>{op.isOpen ? "운영" : "휴무"}</span>
          </Operation>
        );
      })}

      <GapBox h="1.75rem" />

      {/* 2. 휴무일 설정 섹션 헤더 */}
      <SectionHeader>
        <span>휴무일 설정</span>
      </SectionHeader>

      {/* 등록된 휴무일 리스트 렌더링 */}
      <HolidayListWrapper>
        {currentClosedDays.map((holiday, index) => (
          <HolidayItem
            key={index}
            holiday={holiday}
            onRemove={() => removeHoliday(index)}
          />
        ))}
      </HolidayListWrapper>

      {/* 캘린더 모달을 열기 위한 '추가하기' 버튼 */}
      <AddHolidayBtn onClick={() => setCalendarOpen(true)}>
        + 추가하기
      </AddHolidayBtn>
      <GapBox h="2rem" />

      {/* 캘린더 모달 컴포넌트 */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setCalendarOpen(false)}
        onSelect={handleCalendarSelect} // 날짜 등록 및 모달 닫기 로직 연결
        selectedDates={selectedDates} // 캘린더의 선택 상태 (시작일/종료일)
        setSelectedDates={setSelectedDates} // 캘린더 내부에서 선택 상태 변경 시 사용
      />
    </div>
  );
};

export default OperatingTimeForm;

// --- styled ---
const paddingRightRem = "3.75rem";
export const Operation = styled.div`
  display: flex;
  align-items: center;
  height: 2.875rem;
  width: 100%;
  margin-bottom: 0.5rem;

  h4 {
    padding: 0 0.59rem;
  }
  h5 {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 2.875rem;
    letter-spacing: -0.00963rem;
    margin-right: 1rem;
  }
  span {
    padding: 0 0.59rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 2.875rem;
    letter-spacing: -0.00825rem;
  }
`;

export const TimeBox = styled.div`
  width: 15.5rem;
  display: flex;
  align-items: center;
`;

export const SwitchWrapper = styled.div`
  margin-left: 0.5rem;
`;

export const AddHolidayBtn = styled.button`
  color: ${colors.maincolor};
  gap: 0.5rem;
  cursor: pointer;
  display: flex;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 171.429% */
  letter-spacing: -0.00963rem;
`;

const HolidayListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  padding-right: ${paddingRightRem};
`;
