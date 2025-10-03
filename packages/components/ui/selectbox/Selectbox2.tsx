import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";

interface Option {
  label: string;
  value: string;
}

interface SelectBoxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string | number;
  disabled?: boolean;
}

export default function SelectBox2({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  width = "100%",
  disabled = false,
}: SelectBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (disabled) return; // disabled면 클릭 무시
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (val: string) => {
    if (disabled) return; // disabled면 선택 무시
    onChange(val);
    setIsOpen(false);
  };

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <Container width={width} ref={ref}>
      <SelectedBox onClick={handleToggle} disabled={disabled}>
        {selectedLabel || <Placeholder>{placeholder}</Placeholder>}
        <ArrowWrapper>
          {isOpen ? <SlArrowUp size={14} /> : <SlArrowDown size={14} />}
        </ArrowWrapper>
      </SelectedBox>

      {isOpen && (
        <OptionList>
          {options.map((opt) => (
            <OptionItem
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              isSelected={opt.value === value}
            >
              {opt.label}
            </OptionItem>
          ))}
        </OptionList>
      )}
    </Container>
  );
}

const Container = styled.div<{ width: string | number }>`
  position: relative;
  width: ${({ width }) => (typeof width === "number" ? `${width}px` : width)};
`;

const SelectedBox = styled.div<{ disabled?: boolean }>`
  border: 1px solid ${colors.graycolor10};
  border-radius: 8px;
  padding: 0 12px;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  font-size: 14px;
  background-color: white;
`;

const Placeholder = styled.span`
  color: ${colors.graycolor50};
`;

const ArrowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;
  svg {
    color: ${colors.graycolor50};
  }
`;

const OptionList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  border: 1px solid ${colors.graycolor10};
  border-radius: 8px;
  background-color: white;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  list-style: none;
  padding: 4px 0;
`;

const OptionItem = styled.li<{ isSelected: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  background-color: ${({ isSelected }) =>
    isSelected ? colors.graycolor10 : "transparent"};

  &:hover {
    background-color: ${colors.graycolor10};
  }
`;
