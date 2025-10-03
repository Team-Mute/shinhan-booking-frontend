// /** @jsxImportSource @emotion/react */
// "use client";

// /**
//  *
//  * 사용자 메인페이지 검색바
//  *
//  */

// import React, { useState, useRef, useEffect } from "react";
// import styled from "@emotion/styled";
// import colors from "@styles/theme";
// import ArrowDown from "@styles/icons/arrow-down.svg";
// import ArrowUp from "@styles/icons/arrow-up.svg";
// import Location from "@styles/icons/location.svg";

// type Option = {
//   label: string;
//   value: string;
// };

// interface SearchBarProps {
//   options: Option[];
//   selectedValue: string;
//   onSelectChange: (value: string) => void;
//   placeholder?: string;
//   searchValue: string;
//   onSearchChange: (value: string) => void;
//   onEnter?: (value: string) => void; // ⬅️ 부모에서 검색 실행 함수 받기
// }

// export default function SearchBar({
//   options,
//   selectedValue,
//   onSelectChange,
//   placeholder = "공간명, 담당자로 검색",
//   searchValue,
//   onSearchChange,
//   onEnter,
// }: SearchBarProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   const handleToggle = () => setIsOpen((prev) => !prev);
//   const handleSelect = (val: string) => {
//     onSelectChange(val);
//     setIsOpen(false);
//   };

//   // 외부 클릭 시 닫기
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const selectedLabel = options.find((o) => o.value === selectedValue)?.label;

//   return (
//     <Wrapper ref={ref}>
//       {/* Select 영역 */}
//       <SelectContainer onClick={handleToggle}>
//         <Location />
//         <span>{selectedLabel || "서울"}</span>
//         {isOpen ? <ArrowUp /> : <ArrowDown />}
//         {isOpen && (
//           <OptionList>
//             {options.map((opt) => (
//               <OptionItem
//                 key={opt.value}
//                 isSelected={opt.value === selectedValue}
//                 onClick={(e) => {
//                   e.stopPropagation(); // 클릭 이벤트 버블링 방지
//                   handleSelect(opt.value);
//                 }}
//               >
//                 {opt.label}
//               </OptionItem>
//             ))}
//           </OptionList>
//         )}
//       </SelectContainer>
//       <Divider>
//         <Line />
//       </Divider>

//       {/* Search 영역 */}
//       <SearchInput
//         type="text"
//         placeholder={placeholder}
//         value={searchValue}
//         onChange={(e) => onSearchChange(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" && onEnter) {
//             onEnter(searchValue); // 부모에서 내려준 콜백 실행
//           }
//         }}
//       />
//     </Wrapper>
//   );
// }

// // --- styled ---
// const Wrapper = styled.div`
//   display: flex;
//   align-items: center;
//   position: relative;
// `;

// const SelectContainer = styled.div`
//   display: flex;
//   align-items: center;
//   //   width: 5.125rem;
//   height: 3rem;
//   padding: 0.75rem;
//   border-radius: 1.875rem 0 0 1.875rem;
//   font-size: 0.875rem;
//   gap: 0.25rem;
//   background: ${colors.graycolor5};
//   font-weight: 500;
//   cursor: pointer;
//   position: relative;
//   user-select: none;

//   span {
//     white-space: nowrap; /* 줄바꿈 방지 */
//     flex-shrink: 0; /* 내용이 줄어들지 않게 */
//   }
// `;

// const OptionList = styled.ul`
//   position: absolute;
//   top: calc(100% + 4px);
//   left: 0;
//   width: 100%;
//   background: white;
//   border-radius: 8px;
//   border: 1px solid ${colors.graycolor10};
//   list-style: none;
//   padding: 4px 0;
//   margin: 0;
//   z-index: 100;
// `;

// const OptionItem = styled.li<{ isSelected: boolean }>`
//   padding: 8px 12px;
//   font-size: 14px;
//   background-color: ${({ isSelected }) =>
//     isSelected ? colors.graycolor10 : "transparent"};
//   cursor: pointer;
//   &:hover {
//     background-color: ${colors.graycolor10};
//   }
// `;

// const SearchInput = styled.input`
//   // display: flex;
//   width: 100%;
//   height: 3rem;
//   padding: 0.5rem 0.63rem;
//   border: none;
//   outline: none;
//   font-size: 0.875rem;
//   background: ${colors.graycolor5};
//   border-radius: 0 1.875rem 1.875rem 0;
// `;

// const Divider = styled.div`
//   width: 0.3rem;
//   height: 3rem;
//   background-color: ${colors.graycolor5};
//   padding-top: 0.5rem;
//   padding-bottom: 0.5rem;
//   padding-left: 0.25rem;
// `;

// const Line = styled.div`
//   border-right: 1px solid ${colors.graycolor10};
//   width: 1px;
//   height: 100%;
// `;
