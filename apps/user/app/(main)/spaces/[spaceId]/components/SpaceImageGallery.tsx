"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import { media } from "@styles/breakpoints";

/**
 * SpaceDetail 타입 정의
 * - 메인 이미지와 상세 이미지 배열
 */
interface SpaceDetail {
  spaceImageUrl: string;
  detailImageUrls: string[];
}

/**
 * SpaceImageGalleryProps 타입 정의
 * - spaceDetail: SpaceDetail 또는 undefined
 */
interface SpaceImageGalleryProps {
  spaceDetail: SpaceDetail | undefined;
}

/**
 * SpaceImageGallery 컴포넌트
 * ----------------------------
 * 공간 이미지 갤러리
 * - 데스크탑: 메인 이미지 + 4개의 상세 이미지 표시
 * - 모바일: 슬라이드 형태, 좌우 화살표 및 현재 슬라이드 뱃지 표시
 */
export default function SpaceImageGallery({
  spaceDetail,
}: SpaceImageGalleryProps) {
  // ---------------- 상태 ----------------
  const [currentSlide, setCurrentSlide] = useState(1); // 현재 슬라이드 인덱스
  const scrollRef = useRef<HTMLDivElement>(null); // 이미지 스크롤 레퍼런스
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 판단

  // ---------------- 이미지 배열 ----------------
  const allImageUrls = [
    spaceDetail?.spaceImageUrl, // 메인 이미지
    ...(spaceDetail?.detailImageUrls || []).slice(0, 4), // 상세 이미지 최대 4개
  ].filter((url) => url) as string[];

  const totalSlides = allImageUrls.length;

  // ---------------- 스크롤 시 현재 슬라이드 계산 ----------------
  const handleScroll = useCallback(() => {
    if (scrollRef.current && isMobile) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const imageWidth = window.innerWidth;
      let newIndex = Math.round(scrollLeft / imageWidth) + 1;
      if (newIndex <= 0) newIndex = 1;
      if (newIndex > totalSlides) newIndex = totalSlides;
      setCurrentSlide(newIndex);
    }
  }, [isMobile, totalSlides]);

  // ---------------- 모바일 여부 감지 ----------------
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ---------------- 화살표 클릭 이동 함수 ----------------
  const handleMove = (direction: "prev" | "next") => {
    if (!scrollRef.current) return;
    const imageWidth = window.innerWidth;
    const newIndex =
      direction === "next"
        ? Math.min(currentSlide + 1, totalSlides)
        : Math.max(currentSlide - 1, 1);

    const scrollTo = (newIndex - 1) * imageWidth;
    scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    setCurrentSlide(newIndex);
  };

  // ---------------- 이미지 렌더링 ----------------
  const renderImages = () => (
    <>
      {/* 메인 이미지 또는 빈 박스 */}
      {spaceDetail?.spaceImageUrl ? (
        <MainImg src={spaceDetail.spaceImageUrl} alt="main image" />
      ) : (
        <EmptyBox />
      )}
      {/* 상세 이미지 그리드 */}
      <SubImages>
        {Array.from({ length: 4 }).map((_, idx) => {
          const url = spaceDetail?.detailImageUrls[idx];
          return url ? (
            <SubImg key={idx} src={url} alt={`detail image ${idx + 1}`} />
          ) : (
            <EmptyBox key={idx} />
          );
        })}
      </SubImages>
    </>
  );

  return (
    <ImageSlider>
      {/* 모바일에서만 보이는 뱃지 */}
      {isMobile && totalSlides > 0 && (
        <SlideBadge>
          {currentSlide}/{totalSlides}
        </SlideBadge>
      )}

      {/* 좌우 화살표 버튼 (모바일 전용) */}
      {isMobile && totalSlides > 1 && (
        <>
          {currentSlide > 1 && (
            <ArrowButtonLeft onClick={() => handleMove("prev")}>
              ‹
            </ArrowButtonLeft>
          )}
          {currentSlide < totalSlides && (
            <ArrowButtonRight onClick={() => handleMove("next")}>
              ›
            </ArrowButtonRight>
          )}
        </>
      )}
      {/* 이미지 그리드 */}
      <ImageWrapper ref={scrollRef} onScroll={handleScroll}>
        {renderImages()}
      </ImageWrapper>
    </ImageSlider>
  );
}

// --- styled ---
const SlideBadge = styled.div`
  display: none;
  ${media.mobile} {
    display: flex;
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 0.25rem 0.625rem;
    border-radius: 1rem;
    z-index: 10;
    font-size: 0.8rem;
    pointer-events: none;
  }
`;

const ImageSlider = styled.div`
  width: 100%;
  position: relative;
  display: block;
  overflow: visible; /* ✅ 높이 계산 정상화 */
  margin-bottom: 4rem; /* ✅ 아래 콘텐츠와 간격 확보 */
  ${media.mobile} {
    overflow-x: hidden;
    width: 100%;
    margin-bottom: 2rem;
  }
`;

const ImageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 메인 이미지를 조금 작게 */
  gap: 1rem;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  position: relative; /* ✅ absolute 제거 */
  overflow: hidden; /* ✅ 내부 정리 */

  ${media.mobile} {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    width: 100%;
    height: 15rem; /* 모바일 높이 */
    gap: 0;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const MainImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.625rem;
  display: block; /* ✅ inline gap 방지 */

  ${media.mobile} {
    flex: 0 0 100%;
    height: 100%;
    border-radius: 0;
    scroll-snap-align: start;
  }
`;

const SubImages = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;

  width: 100%;
  height: 100%;
  position: static; /* ✅ 절대배치 금지 */

  ${media.mobile} {
    display: contents;
  }
`;

const SubImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.625rem;
  ${media.mobile} {
    flex: 0 0 100%;
    height: 100%;
    border-radius: 0;
    scroll-snap-align: start;
  }
`;

const EmptyBox = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.625rem;
  background-color: #e0e0e0;
  ${media.mobile} {
    flex: 0 0 100%;
    height: 100%;
    border-radius: 0;
    scroll-snap-align: start;
  }
`;

// ✅ 화살표 버튼 (모바일 전용)
const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 20;
  transition: background 0.2s;
  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
  ${media.desktop} {
    display: none;
  }
`;

const ArrowButtonLeft = styled(ArrowButton)`
  left: 0.75rem;
`;

const ArrowButtonRight = styled(ArrowButton)`
  right: 0.75rem;
`;
