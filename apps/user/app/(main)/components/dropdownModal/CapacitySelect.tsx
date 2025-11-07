"use client";

import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";

/**
 * @interface CapacitySelectProps
 * @description 인원 선택 컴포넌트의 Props 정의
 * @property {number} value 현재 선택된 인원 수
 * @property {(newValue: number) => void} onChange 인원 수 변경 시 호출될 콜백 함수
 */
interface CapacitySelectProps {
  value: number;
  onChange: (newValue: number) => void;
}

/**
 * CapacitySelect 컴포넌트
 * ----------------------------
 * 인원 수(Capacity)를 증가/감소시키는 UI 컴포넌트
 * - 사용자 메인 페이지의 필터 모달 및 예약 페이지에서 사용
 * - 인원 수는 0 미만으로 감소 불가
 *
 * @param {CapacitySelectProps} props - 현재 값과 변경 핸들러
 */
export default function CapacitySelect({
  value,
  onChange,
}: CapacitySelectProps) {
  /**
   * @description 인원 수를 1 감소시키고 onChange를 호출 (최소 0)
   */
  const handleDecrease = () => {
    if (value > 0) onChange(value - 1);
  };

  /**
   * @description 인원 수를 1 증가시키고 onChange를 호출
   */
  const handleIncrease = () => {
    onChange(value + 1);
  };

  return (
    <Wrapper>
      <Label>인원</Label>
      <Controls>
        {/* 인원 감소 버튼: value가 0이면 비활성화 */}
        <CircleButton onClick={handleDecrease} disabled={value === 0}>
          <img src="/icons/subtract.svg" alt="인원 감소" />
        </CircleButton>
        {/* 현재 인원 수 표시 */}
        <Count>{value}</Count>
        {/* 인원 증가 버튼 */}
        <CircleButton onClick={handleIncrease}>
          <img src="/icons/plus.svg" alt="인원 증가" />
        </CircleButton>
      </Controls>
    </Wrapper>
  );
}

// --- styled ---
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Label = styled.span`
  font-size: 1rem;
  font-weight: 500;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CircleButton = styled.button<{ disabled?: boolean }>`
  width: 1.43rem;
  height: 1.43rem;
  border-radius: 50%;
  color: ${colors.maincolor};
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.maincolor5};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  border: none;
  padding: 0;

  img {
    width: 0.75rem; /* 아이콘 크기 조정 */
    height: 0.75rem;
  }
`;

const Count = styled.span`
  font-size: 1rem;
  font-weight: 600;
  min-width: 1.5rem; /* 숫자가 바뀌어도 레이아웃 유지 */
  text-align: center;
`;
