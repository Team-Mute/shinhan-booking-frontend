"use client";

import React from "react";
import {
  ModalContainer,
  Overlay,
  Header,
  CloseButton,
  Footer,
} from "./SpaceFormModal/styles";
import { IoCloseOutline } from "react-icons/io5";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import Button from "@components/ui/button/Button";
import { GapBox } from "@admin/components/GapBox";
import CustomCalendar from "@components/CustomCalendar";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (start: string, end?: string) => void;

  selectedDates: { start: Date | null; end: Date | null };
  setSelectedDates: React.Dispatch<
    React.SetStateAction<{ start: Date | null; end: Date | null }>
  >;
}

const CalendarModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
  selectedDates,
  setSelectedDates,
}) => {
  if (!isOpen) return null;

  // Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // 캘린더에서 날짜 선택 시 호출되는 핸들러
  const handleCalendarSelect = (result: {
    single?: string;
    range?: [string, string];
  }) => {
    const { single, range } = result;

    if (range) {
      // 기간 선택 완료 시 (start, end)
      const [startStr, endStr] = range;
      setSelectedDates({
        start: new Date(startStr),
        end: new Date(endStr),
      });
    } else if (single) {
      // 단일 날짜 선택 시 (시작일이거나, 새 기간의 시작)
      const newDate = new Date(single);

      if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
        // 초기 선택 또는 기간 초기화
        setSelectedDates({ start: newDate, end: null });
      } else if (selectedDates.start) {
        // 두 번째 날짜 선택
        if (newDate.getTime() < selectedDates.start.getTime()) {
          // 종료일이 시작일보다 앞선 경우 (순서 교체)
          setSelectedDates({ start: newDate, end: selectedDates.start });
        } else {
          // 정상적인 종료일 선택
          setSelectedDates({ start: selectedDates.start, end: newDate });
        }
      }
    }
  };

  // 등록 버튼 활성화 여부
  const isRegisterActive = !!selectedDates.start;

  // 등록 버튼 클릭 핸들러
  const handleRegister = () => {
    if (!selectedDates.start) return;

    const start = formatDate(selectedDates.start);
    const end = selectedDates.end ? formatDate(selectedDates.end) : undefined;

    onSelect(start, end); // 부모 컴포넌트의 휴무일 추가 로직 호출
    // onSelect 내부에서 모달을 닫도록 구현했으므로, 여기서 닫을 필요는 없음
    // 단, 캘린더 상태는 여기서 초기화
    setSelectedDates({ start: null, end: null });
  };

  return (
    <Overlay>
      <ModalContainer
        role="dialog"
        aria-modal="true"
        aria-labelledby="sfm-title"
      >
        <Header>
          <h2 id="sfm-title">하루 또는 기간 선택</h2>
          <CloseButton onClick={onClose} aria-label="닫기">
            <IoCloseOutline size={26} />
          </CloseButton>
        </Header>
        <CalendarWrapper>
          <CustomCalendar
            selectsRange={true}
            onSelectDate={handleCalendarSelect} // ⭐️ 수정: 새로운 핸들러 연결
            selectedStart={selectedDates.start} // ⭐️ 수정: 상태 전달
            selectedEnd={selectedDates.end} // ⭐️ 수정: 상태 전달
          />
        </CalendarWrapper>

        <GapBox h="1.94rem" />
        <Footer>
          <Button onClick={handleRegister} isActive={isRegisterActive}>
            휴무일로 등록하기
          </Button>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default CalendarModal;

// --- styled ---
const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-conttent: center;
  align-items: center;
`;
