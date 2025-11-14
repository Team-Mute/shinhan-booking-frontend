import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";

/**
 * 단일 시간 옵션 타입
 * -------------------
 * time: "HH:mm" 형식 (예: "09:00")
 * isAvailable: 선택 가능한 시간 여부
 */
export interface TimeOption {
  time: string; // "HH:mm" 형식 (예: "09:00")
  isAvailable: boolean;
}

/**
 * PrevisitTimeChipGroup Props
 * ---------------------------
 * options: 선택 가능한 시간 배열
 * selected: 현재 선택된 시간 ("HH:mm")
 * onToggle: 칩 클릭 시 선택/해제 콜백
 * columns: 한 줄에 표시할 칩 개수 (기본 4)
 */
interface PrevisitChipGroupProps {
  options: TimeOption[];
  selected: string; // 선택된 시간 ("HH:mm")
  onToggle: (chip: string) => void;
  columns?: number;
}

/**
 * PrevisitTimeChipGroup 컴포넌트
 * -------------------------------
 * - 시간 선택용 칩 UI
 * - 선택/비활성 상태를 시각적으로 구분
 * - 클릭 가능 여부(isAvailable)에 따라 onToggle 호출
 */
const PrevisitTimeChipGroup: React.FC<PrevisitChipGroupProps> = ({
  options,
  selected,
  onToggle,
  columns = 4,
}) => {
  /**
   * @description 칩 클릭 처리
   * - 선택 가능(chip.isAvailable)인 경우에만 onToggle 호출
   */
  const handleClick = (chip: TimeOption) => {
    if (chip.isAvailable) {
      onToggle(chip.time);
    }
  };

  return (
    <Grid columns={columns}>
      {options.map((chip) => {
        const isSelected = selected === chip.time;

        return (
          <Chip
            key={chip.time}
            data-selected={isSelected}
            data-disabled={!chip.isAvailable}
            onClick={() => handleClick(chip)}
            disabled={!chip.isAvailable}
          >
            {chip.time}
          </Chip>
        );
      })}
    </Grid>
  );
};

export default PrevisitTimeChipGroup;

// --- styled ---
const Grid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.columns}, 1fr);
  gap: 0.5rem;
`;

const Chip = styled.button`
  width: 5.14rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.graycolor10};
  line-height: 2.875rem;
  font-size: 0.875rem;
  font-weight: 500;

  color: ${colors.graycolor50};

  &[data-selected="true"] {
    border-color: ${colors.maincolor};
    background-color: ${colors.maincolor5};
    color: ${colors.maincolor};
  }

  &[data-disabled="true"] {
    cursor: not-allowed;
    border-color: ${colors.graycolor5};
    background-color: ${colors.graycolor5};
    color: ${colors.graycolor30}; /* 텍스트를 회색으로 연하게 처리 */
  }
`;
