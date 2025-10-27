import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";

/**
 * FilterSelectBox.tsx
 * 
 * 필터링을 위한 SelectBox 컴포넌트
 * 필터 영역의 네이티브 <select>를 대체하는 커스텀 드롭다운 컴포넌트입니다.
 */
interface Option {
  label: string;
  value: string;
}

interface SelectBoxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function FilterSelectBox({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
}: SelectBoxProps) {

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Container ref={ref}>
      <SelectedBox onClick={handleToggle}>
        {selectedOption && selectedOption.label !== placeholder ? (
          <span>{selectedOption.label}</span>
        ) : (
          <Placeholder>{placeholder}</Placeholder>
        )}
        <ArrowWrapper>
          {isOpen ? <SlArrowUp /> : <SlArrowDown />}
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

const Container = styled.div`
  position: relative;
  /* 기존 DropdownContainer의 유연한 너비 설정 반영 */
  flex: 1;
  min-width: 60px;
  max-width: 150px;
`;

const SelectedBox = styled.div`
  background: #f3f4f4;
  border-radius: 12px;
  height: 41px;
  padding: 8px 12px;
  gap: 12px;

  border: none;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  width: 100%;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Placeholder = styled.span`
  color: #a0a0a0; 
`;

const ArrowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;
  svg {
    color: #a0a0a0;
  }
`;

const OptionList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;

  background: white;
  border: 1px solid #e0e0e0; 
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px 0;
  list-style: none;
`;

const OptionItem = styled.li<{ isSelected: boolean }>`
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
  background-color: ${({ isSelected }) =>
    isSelected ? '#F2F6FF' : 'white'}; /* 선택 시 연한 파랑 */
  color: #1A1A1A;
  &:hover {
    background-color: '#F2F6FF'; /* 호버 시 연한 파랑 */
    color: '#1A1A1A'; /* 호버 시 진한 파랑 */
  }
`;