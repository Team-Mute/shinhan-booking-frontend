/** @jsxImportSource @emotion/react */
"use client";

import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

type Option = {
  label: string;
  value: string;
};

interface SearchBarProps {
  options: Option[];
  selectedValue: string;
  onSelectChange: (value: string) => void;
  placeholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function SearchBar({
  options,
  selectedValue,
  onSelectChange,
  placeholder = "공간명, 담당자로 검색",
  searchValue,
  onSearchChange,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleSelect = (val: string) => {
    onSelectChange(val);
    setIsOpen(false);
  };

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === selectedValue)?.label;

  return (
    <Wrapper ref={ref}>
      {/* Select 영역 */}
      <SelectContainer onClick={handleToggle}>
        <span>{selectedLabel || "전체"}</span>
        {isOpen ? <SlArrowUp size={13} /> : <SlArrowDown size={13} />}
        {isOpen && (
          <OptionList>
            {options.map((opt) => (
              <OptionItem
                key={opt.value}
                isSelected={opt.value === selectedValue}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </OptionItem>
            ))}
          </OptionList>
        )}
      </SelectContainer>
      <Divider>
        <Line />
      </Divider>

      {/* Search 영역 */}
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Wrapper>
  );
}

// --- styled ---
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  //   width: 5.125rem;
  height: 3rem;
  padding: 0.75rem;
  border-radius: 0.75rem 0 0 0.75rem;
  font-size: 0.875rem;
  gap: 1rem;
  background: ${colors.graycolor5};
  font-weight: 500;
  cursor: pointer;
  position: relative;
  user-select: none;

  span {
    white-space: nowrap; /* 줄바꿈 방지 */
    flex-shrink: 0; /* 내용이 줄어들지 않게 */
  }
`;

const OptionList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: white;
  border-radius: 8px;
  border: 1px solid ${colors.graycolor10};
  list-style: none;
  padding: 4px 0;
  margin: 0;
  z-index: 100;
`;

const OptionItem = styled.li<{ isSelected: boolean }>`
  padding: 8px 12px;
  font-size: 14px;
  background-color: ${({ isSelected }) =>
    isSelected ? colors.graycolor10 : "transparent"};
  cursor: pointer;
  &:hover {
    background-color: ${colors.graycolor10};
  }
`;

const SearchInput = styled.input`
  display: flex;
  width: 100%;
  height: 3rem;
  padding: 0.5rem 0.63rem;
  border: none;
  outline: none;
  font-size: 0.875rem;
  background: ${colors.graycolor5};
  border-radius: 0 0.75rem 0.75rem 0;
`;

const Divider = styled.div`
  width: 0.3rem;
  height: 3rem;
  background-color: ${colors.graycolor5};
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.25rem;
`;

const Line = styled.div`
  border-right: 1px solid ${colors.graycolor10};
  width: 1px;
  height: 100%;
`;
