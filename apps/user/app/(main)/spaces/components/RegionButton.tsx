// RegionButton.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom"; // createPortal 추가
import styled from "@emotion/styled";
import colors from "@styles/theme";
import breakpoints, { media } from "@styles/breakpoints"; // 모바일 구분 및 미디어 쿼리 사용을 위해 추가
import { IoCloseOutline } from "react-icons/io5";

interface RegionButtonProps {
  label: string; // 예: "지역"
  options: { regionId: number; regionName: string }[];
  selectedRegionId: number | null;
  onSelect: (regionId: number) => void;
}

/**
 * RegionButton 컴포넌트
 * ----------------------
 * 지역 필터링 버튼과 Portal 기반 드롭다운/모바일 모달 UI를 제공.
 */
export default function RegionButton({
  label,
  options,
  selectedRegionId,
  onSelect,
}: RegionButtonProps) {
  const [isOpen, setIsOpen] = useState(false); // 드롭다운/모달 열림 상태
  const buttonRef = useRef<HTMLDivElement>(null); // 버튼 요소 참조 (위치 계산용)
  const [isMobile, setIsMobile] = useState(false); // 현재 모바일 환경인지 여부 상태
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 }); // 데스크탑 드롭다운 위치 상태

  // 화면 크기 감지 (모바일 여부 판단)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoints.mobile})`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // 버튼 위치 계산 (데스크탑에서 Portal 위치 지정용)
  useEffect(() => {
    if (!buttonRef.current || isMobile || !isOpen) return; // 모바일이거나 닫혀있으면 실행 안 함
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY + 8, // 버튼 아래 + 8px 여백
      left: rect.left + window.scrollX, // 버튼 왼쪽 정렬
    });
  }, [isOpen, isMobile]);

  /**
   * @description 지역 선택 및 드롭다운 닫기 처리.
   */
  const handleSelect = (regionId: number) => {
    onSelect(regionId);
    setIsOpen(false);
  };

  /**
   * @description 현재 선택된 지역 이름 검색.
   */
  const selectedRegion = options.find(
    (r) => r.regionId === selectedRegionId
  )?.regionName;

  // Portal 렌더링 함수
  const renderDropdown = () => {
    if (!isOpen) return null;

    // 드롭다운 목록 콘텐츠 (모바일/데스크탑에서 재사용)
    const dropdownContent = (
      <DropdownContent>
        {options.map((region) => (
          <Option
            key={region.regionId}
            onClick={() => handleSelect(region.regionId)}
            selected={region.regionId === selectedRegionId}
          >
            {region.regionName}
          </Option>
        ))}
      </DropdownContent>
    );

    // 모바일/데스크탑 분기 처리하여 Portal 렌더링
    return createPortal(
      isMobile ? (
        // 모바일: 전체 화면을 덮는 오버레이 모달 사용
        <MobileOverlay>
          <MobileHeader>
            <MobileTitle>지역 선택</MobileTitle>
            <MobileCloseButton onClick={() => setIsOpen(false)}>
              <IoCloseOutline size={24} />
            </MobileCloseButton>
          </MobileHeader>
          {dropdownContent}
        </MobileOverlay>
      ) : (
        // 데스크탑: 계산된 위치에 일반 드롭다운 표시
        <DesktopDropdown
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          {dropdownContent}
        </DesktopDropdown>
      ),
      document.body // DOM의 body 태그에 렌더링
    );
  };

  return (
    <Wrapper ref={buttonRef}>
      <Button onClick={() => setIsOpen((prev) => !prev)}>
        <img src="/icons/location.svg" alt="location" />
        <LabelSpan>{selectedRegion || label}</LabelSpan>{" "}
        {/* 선택된 지역명 또는 레이블 표시 */}
        <img src={`/icons/arrow-${isOpen ? "up" : "down"}.svg`} alt="arrow" />
      </Button>

      {/* Portal 렌더링 함수 호출 */}
      {renderDropdown()}
    </Wrapper>
  );
}

// --- styled ---
const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  z-index: 10; /* 필터 버튼 중 z-index 우선순위 확보 */
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.62rem 1rem;
  border-radius: 1.875rem;
  background-color: ${colors.graycolor5};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
`;

const LabelSpan = styled.span`
  white-space: nowrap; /* 글자 줄바꿈 방지 */
  writing-mode: horizontal-tb; /* 가로쓰기 명시 */
`;

const DesktopDropdown = styled.div`
  position: absolute; /* Portal로 띄우고, JS로 계산된 위치 적용 */
  z-index: 1000;
`;

const DropdownContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  min-width: 8rem;
  padding: 0.5rem 0;

  /* 모바일 (MobileOverlay 내부) 스타일 재정의 */
  ${media.mobile} {
    border-radius: 0;
    box-shadow: none;
    min-width: 100%;
    height: 100%;
    padding: 1rem 0;
  }
`;

const Option = styled.div<{ selected: boolean }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background: ${({ selected }) =>
    selected ? colors.graycolor5 : "transparent"};

  &:hover {
    background: ${colors.graycolor10};
  }
`;

// 모바일: 전체 화면을 덮는 오버레이
const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 10000; /* 최상위 z-index */
  display: flex;
  flex-direction: column;

  /* 데스크탑에서는 숨김 */
  ${media.mobileUp} {
    display: none;
  }
`;

// 모바일 오버레이 상단 헤더
const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${colors.graycolor10};
`;

const MobileTitle = styled.h2`
  font-weight: 600;
  font-size: 1.125rem;
`;

const MobileCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;
