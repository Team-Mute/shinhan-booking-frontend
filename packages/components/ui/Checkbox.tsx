import React from "react";
import styled from "@emotion/styled";
import { FiCheck } from "react-icons/fi";
import colors from "@styles/theme";

interface CircleCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  isUnderlined?: boolean;
  labelClickable?: boolean; // 라벨 클릭 시 이벤트 발생하는 경우 사용 ex) 약관 확인 모달 띄우기
  onLabelClick?: () => void;
}

const CircleCheckbox = ({
  checked,
  onChange,
  label,
  isUnderlined = false,
  labelClickable = false,
  onLabelClick,
}: CircleCheckboxProps) => {
  return (
    <CheckboxWrapper>
      <StyledCircle onClick={onChange} checked={checked}>
        <FiCheck size={11} color={checked ? "#fff" : colors.graycolor100} />
      </StyledCircle>
      {label && (
        <LabelText
          isUnderlined={isUnderlined}
          labelClickable={labelClickable}
          onClick={labelClickable ? onLabelClick : undefined}
        >
          {label}
        </LabelText>
      )}
    </CheckboxWrapper>
  );
};

export default CircleCheckbox;

// styled

const CheckboxWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 3px 0;
`;

const StyledCircle = styled.div<{ checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${({ checked }) =>
    checked ? colors.maincolor : colors.graycolor10};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  cursor: pointer;
`;

const LabelText = styled.span<{
  isUnderlined: boolean;
  labelClickable?: boolean;
}>`
  margin-left: 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.graycolor100};
  text-decoration: ${({ isUnderlined }) =>
    isUnderlined ? "underline" : "none"};
  cursor: ${({ labelClickable }) => (labelClickable ? "pointer" : "default")};
`;
