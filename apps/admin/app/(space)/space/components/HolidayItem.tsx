// 경로: @admin/components/space/SpaceForm/HolidayItem.tsx (OperatingTimeForm와 같은 폴더에 위치한다고 가정)

import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { IoClose } from "react-icons/io5";
import { ClosedDay } from "@admin/types/dto/space.dto";

interface HolidayItemProps {
  holiday: ClosedDay;
  onRemove: () => void;
}

// "YYYY-MM-DDTHH:mm:ss" 형식에서 "YYYY.MM.DD"만 추출하는 유틸리티
const formatDateForDisplay = (isoString: string) => {
  // T를 기준으로 분리하고, 첫 번째 요소인 날짜를 .으로 변경
  return isoString.split("T")[0].replace(/-/g, ".");
};

/**
 * HolidayItem 컴포넌트
 * --------------------
 * 등록된 휴무일 하나를 표시하고 삭제 버튼을 제공.
 */
const HolidayItem: React.FC<HolidayItemProps> = ({ holiday, onRemove }) => {
  const start = formatDateForDisplay(holiday.from);
  const end = formatDateForDisplay(holiday.to);

  // 하루 휴무인지 기간 휴무인지 판단
  const isSingleDay = holiday.from.split("T")[0] === holiday.to.split("T")[0];

  const displayDate = isSingleDay ? start : `${start} - ${end}`;

  return (
    <Container>
      <DateText>{displayDate}</DateText>
      <RemoveButton onClick={onRemove} aria-label="휴무일 삭제">
        <img src="/icons/delete.svg" />
      </RemoveButton>
    </Container>
  );
};

export default HolidayItem;

// --- styled ---
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid ${colors.graycolor10};
  border-radius: 0.5rem;
  background-color: white;
`;

const DateText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.graycolor100};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.graycolor50};
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: ${colors.negativecolor};
  }
`;
