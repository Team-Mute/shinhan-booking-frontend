"use client";

import React, { useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { SpaceDetailResponse } from "@user/types/space.dto";
import Map from "./Map";
import { media } from "@styles/breakpoints";
import { GapBox } from "@user/components/GapBox";

interface Props {
  spaceDetail: SpaceDetailResponse | null;
}

/**
 * SpaceDetailTabs 컴포넌트
 * ----------------------------
 * 공간 상세 페이지에서 사용되는 탭형 UI
 * - 데스크탑에서는 탭 형태로, 모바일에서는 스크롤로 위→아래 나열
 * - 공간 안내, 운영시간, 위치, 예약 과정, 이용수칙 정보를 표시
 *
 * @param spaceDetail SpaceDetailResponse | null
 */
export default function SpaceDetailTabs({ spaceDetail }: Props) {
  // ---------------- 상태 관리 ----------------
  const [activeTab, setActiveTab] = useState<"info" | "reservation" | "rules">(
    "info"
  ); // 현재 활성화된 탭

  // ---------------- ref 설정 ----------------
  const infoRef = useRef<HTMLDivElement | null>(null);
  const reservationRef = useRef<HTMLDivElement | null>(null);
  const rulesRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  // ---------------- 스크롤 이벤트 ----------------
  /**
   * 스크롤 위치에 따라 activeTab 업데이트
   * - 스크롤 위치가 예약 과정 >= rules 섹션이면 rules 탭 활성화
   */
  const handleScroll = () => {
    const scrollPos = window.scrollY + 200; // offset 조정
    const reservationTop = reservationRef.current?.offsetTop ?? 0;
    const rulesTop = rulesRef.current?.offsetTop ?? 0;

    if (scrollPos >= rulesTop) {
      setActiveTab("rules");
    } else if (scrollPos >= reservationTop) {
      setActiveTab("reservation");
    } else {
      setActiveTab("info");
    }
  };

  /**
   * ref로 전달된 섹션으로 스크롤 이동
   * @param ref 이동할 섹션의 ref
   */
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 등록
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---------------- 요일/운영시간 렌더링 ----------------
  const dayMap: Record<number, string> = {
    1: "월:",
    2: "화:",
    3: "수:",
    4: "목:",
    5: "금:",
    6: "토:",
    7: "일:",
  };

  /**
   * operations 배열을 이용해 요일별 운영시간 표시
   * - isOpen = false → 휴무일
   */
  const renderOperations = () => {
    if (!spaceDetail?.operations) return null;

    return spaceDetail.operations.map((op) => {
      const isClosed = !op.isOpen;
      return (
        <OperationRow key={op.day}>
          <Day>{dayMap[op.day]}</Day>
          <Time>{isClosed ? "휴무일" : `${op.from} ~ ${op.to}`}</Time>
        </OperationRow>
      );
    });
  };

  return (
    <TapWrapper>
      {/* 데스크탑 탭 */}
      <TabHeader>
        <TabItem
          active={activeTab === "info"}
          onClick={() => scrollTo(infoRef)}
        >
          공간안내
        </TabItem>
        <TabItem
          active={activeTab === "reservation"}
          onClick={() => scrollTo(reservationRef)}
        >
          예약과정
        </TabItem>
        <TabItem
          active={activeTab === "rules"}
          onClick={() => scrollTo(rulesRef)}
        >
          이용수칙
        </TabItem>
      </TabHeader>

      {/* 공간 안내 */}
      <TabContent ref={infoRef}>
        <SectionTitle>공간 안내</SectionTitle>
        <p>{spaceDetail?.spaceDescription}</p>
        <GapBox h="6.6rem" />
        <SectionTitle>운영시간</SectionTitle>
        <OperationsWrapper>{renderOperations()}</OperationsWrapper>
      </TabContent>

      {/* 지도 */}
      <TabContent ref={mapRef}>
        <SectionTitle>위치</SectionTitle>
        <Map
          addressRoad={
            spaceDetail?.location.addressRoad ??
            "서울특별시 중구 명동10길 52 신한익스페이스"
          }
        />
        <AddressWrapper>
          <img src="/icons/marker.svg" />
          <p>{spaceDetail?.location.addressRoad.split(" - ")[0]?.trim()}</p>
        </AddressWrapper>
      </TabContent>

      {/* 예약 과정 */}
      <TabContent ref={reservationRef}>
        <SectionTitle>예약과정</SectionTitle>
        <p>{spaceDetail?.reservationWay}</p>
      </TabContent>

      {/* 이용수칙 */}
      <TabContent ref={rulesRef}>
        <SectionTitle>이용수칙</SectionTitle>
        <p>{spaceDetail?.spaceRules}</p>
      </TabContent>
    </TapWrapper>
  );
}

// --- styled ---
const TapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: white;

  ${media.mobile} {
    padding: 1.25rem;
  }
`;

const TabHeader = styled.div`
  display: flex;
  width: 100%;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  border-bottom: 1px solid ${colors.graycolor5};

  ${media.mobile} {
    display: none;
  }
`;

const TabItem = styled.div<{ active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 1rem 0;
  font-weight: 600;
  cursor: pointer;
  color: ${({ active }) => (active ? colors.graycolor100 : colors.graycolor50)};
  border-bottom: ${({ active }) =>
    active ? `3px solid ${colors.graycolor100}` : "none"};
  transition: color 0.2s, border-bottom 0.2s;
`;

const TabContent = styled.div`
  padding: 3rem 0;
  scroll-margin-top: 60px;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const AddressWrapper = styled.div`
  margin-top: 1.66rem;
  display: flex;
  gap: 0.5rem;
`;

const OperationsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
`;

const OperationRow = styled.div`
  display: flex;
  gap: 0.2rem;
`;

const Day = styled.span`
  width: 2rem;
  font-weight: 500;
`;

const Time = styled.span`
  font-weight: 400;
`;
