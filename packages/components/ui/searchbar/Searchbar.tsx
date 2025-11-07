"use client";

import { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme"; 
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

/**
 * SearchBar.tsx
 * 
 * 검색창 컴포넌트
 *
 * 이 컴포넌트는 드롭다운 선택 기능이 포함될 수도 있고 제외될 수도 있는 유연한 검색 입력 필드입니다.
 *
 * **주요 기능**
 * 1.조건부 드롭다운:`isDropdownVisible` prop에 따라 드롭다운(검색 필터) 영역의 렌더링이 결정됩니다.
 * 2.검색 입력: 검색어 입력 및 `onChange` 핸들링을 처리하며, Enter 키 입력 시 `onSearch` 콜백을 실행합니다.
 * 3.타입 안전성: TypeScript의 유니온 타입과 조건부 타입을 사용하여, 드롭다운이 없을 때는 관련 props(options, selectedValue 등)를 필수로 요구하지 않습니다.
 * 4.외부 클릭 감지: `useEffect`를 사용하여 드롭다운 메뉴 외부 클릭 시 자동으로 닫히도록 구현했습니다.
 *
 * @component
 * @requires React
 * @requires @emotion/styled
 * @requires react-icons/sl (SlArrowDown, SlArrowUp)
 * @requires @styles/theme (for colors)
 *
 * @param {string} [placeholder="검색어를 입력하세요."] - 검색 입력 필드의 플레이스 홀더 텍스트.
 * @param {string} searchValue - 현재 검색 입력 필드의 값. (필수)
 * @param {function(string): void} onSearchChange - 검색 입력 필드 값이 변경될 때 호출되는 콜백. (필수)
 * @param {function(): void} [onSearch] - Enter 키 입력 시 호출되는 검색 실행 콜백.
 * @param {boolean} [isDropdownVisible=true] - 드롭다운 영역의 표시 여부. (이 값에 따라 나머지 props의 필수 여부가 결정됨)
 *
 * @param {Option[]} [options] - 드롭다운 목록에 표시될 옵션 배열. (isDropdownVisible: true일 때 필수)
 * @param {string} [selectedValue] - 현재 선택된 드롭다운 옵션의 값. (isDropdownVisible: true일 때 필수)
 * @param {function(string): void} [onSelectChange] - 드롭다운 옵션이 선택될 때 호출되는 콜백. (isDropdownVisible: true일 때 필수)
 */
type Option = {
  label: string;
  value: string;
};

interface BaseSearchBarProps {
  placeholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch?: () => void;
  isDropdownVisible?: boolean; // isDropdownVisible prop 추가 (이 값에 따라 나머지 props가 결정됨)
}

interface DropdownVisibleProps {
  options: Option[];
  selectedValue: string;
  onSelectChange: (value: string) => void;
}

interface DropdownHiddenProps {
  options?: Option[];
  selectedValue?: string;
  onSelectChange?: (value: string) => void;
}

// 조건부 타입 적용: isDropdownVisible이 false일 때 드롭다운 관련 props 생략 가능
export type SearchBarProps = BaseSearchBarProps &
  (
    | ({ isDropdownVisible: true } & DropdownVisibleProps)
    | ({ isDropdownVisible?: false } & DropdownHiddenProps)
  );

// --- 컴포넌트 본문 ---

export default function SearchBar({
  options = [],
  selectedValue = "",
  onSelectChange = () => {},
  placeholder = "검색어를 입력하세요.",
  searchValue,
  onSearchChange,
  onSearch,
  isDropdownVisible = true,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleSelect = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();

    onSelectChange(val);
    setIsOpen(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch && onSearch();
    }
  };

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <Wrapper ref={ref}> 
      
      {/* 1. 드롭다운 영역: isDropdownVisible이 true일 때만 렌더링 */}
      {isDropdownVisible && (
        <>
          <SelectContainer onClick={handleToggle}>
            <span>
              {options.find((opt) => opt.value === selectedValue)?.label ||
                options[0]?.label ||
                "선택"}
            </span>
            {isOpen ? <SlArrowUp /> : <SlArrowDown />}
          </SelectContainer>
          
          {/* 2. 구분선 (Divider와 Line 사용) */}
          <Divider>
            <Line />
          </Divider>
          
          {/* 3. 옵션 리스트 */}
          {isOpen && (
            <OptionList>
              {options.map((option) => (
                <OptionItem
                  key={option.value}
                  isSelected={option.value === selectedValue}
                  disabled={false}
                  onClick={(e) => handleSelect(option.value, e)}
                >
                  {option.label}
                </OptionItem>
              ))}
            </OptionList>
          )}
        </>
      )}

      {/* 4. 검색 입력 영역 */}
      <SearchInput 
        isDropdownVisible={isDropdownVisible} // SearchInput에도 전달
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
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
  width: 22rem;
  background: white;
  border-radius: 8px;
  border: 1px solid ${colors.graycolor10};
  list-style: none;
  padding: 4px 0;
  margin: 0;
  z-index: 100;
`;

const OptionItem = styled.li<{ isSelected: boolean; disabled: boolean }>`
  padding: 8px 12px;
  font-size: 14px;
  color: ${({ disabled }) =>
    disabled ? colors.graycolor50 : colors.graycolor100};
  background-color: ${({ isSelected }) =>
    isSelected ? colors.graycolor10 : "transparent"};
  cursor: pointer;
  &:hover {
    background-color: ${colors.graycolor10};
  }
`;

const SearchInput = styled.input<{ isDropdownVisible: boolean }>`
  display: flex;
  width: 100%;
  height: 3rem;
  padding: 0.5rem 0.63rem;
  border: none;
  outline: none;
  font-size: 0.875rem;
  background: ${colors.graycolor5};
  border-radius: 0 0.75rem 0.75rem 0;

  /* 드롭다운이 없을 때 SearchInput의 왼쪽 둥근 모서리가 적용되도록 재정의 */
  ${({ isDropdownVisible }) => !isDropdownVisible && `
    border-radius: 0.75rem;
    padding-left: 0.75rem; /* SelectContainer와 동일한 패딩으로 맞춤 */
  `}
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
