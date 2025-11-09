"use client";

import React, { useRef, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import Button from "@components/ui/button/Button";
import { IoCloseOutline } from "react-icons/io5";
import { Input } from "@components/index";
import { useSearchCompany } from "../hooks/useSearchCompany"; // 회사 검색 로직을 위한 커스텀 훅
import { FadeLoader } from "react-spinners";

interface ScrollModalProps {
  isOpen: boolean; // 모달 열림 상태
  onClose: () => void; // 모달 닫기 함수
  onSelectCompany: (name: string) => void; // 회사명 선택(검색/직접입력) 시 호출될 콜백
}

/**
 * SearchModal 컴포넌트
 * ---------------------
 * 회사명 검색 및 선택 기능을 제공하는 모달 컴포넌트.
 *
 * @remarks
 * - useSearchCompany 훅을 통해 검색, 페이징, 로딩 상태 관리.
 * - 검색 결과 영역에 스크롤 기반 무한 로딩 (Infinite Scroll) 구현.
 */
const SearchModal = ({
  isOpen,
  onClose,
  onSelectCompany,
}: ScrollModalProps) => {
  const {
    query,
    setQuery,
    results,
    search,
    loading,
    hasMore,
    loadMore,
    setResults,
    setPageNo,
    setHasMore,
  } = useSearchCompany();

  const resultRef = useRef<HTMLDivElement | null>(null); // 검색 결과 목록 DOM 참조
  const isFetchingRef = useRef(false); // 무한 로딩 중복 호출 방지용 플래그

  /**
   * @description 검색 결과 스크롤 이벤트 핸들러 (무한 스크롤 로직)
   */
  const handleScroll = useCallback(() => {
    if (!resultRef.current || loading || !hasMore || isFetchingRef.current)
      return;

    const { scrollTop, scrollHeight, clientHeight } = resultRef.current;
    const scrollRatio = (scrollTop + clientHeight) / scrollHeight; // 스크롤 비율 계산

    // 스크롤이 70% 이상 내려갔을 때 추가 데이터 로드
    if (scrollRatio >= 0.7) {
      isFetchingRef.current = true;
      loadMore().finally(() => {
        isFetchingRef.current = false; // 로딩 완료 후 플래그 해제
      });
    }
  }, [loading, hasMore, loadMore]); // 의존성: 로딩, hasMore, loadMore

  /**
   * @description 스크롤 이벤트 리스너 등록 및 해제
   */
  useEffect(() => {
    const el = resultRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll); // 클린업: 이벤트 제거
  }, [handleScroll]);

  const [manualInput, setManualInput] = React.useState(""); // 사용자 직접 입력 상태

  /**
   * @description 모달 닫기 전 모든 상태 초기화
   */
  const reset = useCallback(() => {
    setManualInput("");
    setQuery("");
    setResults([]);
    setPageNo(1);
    setHasMore(true);
  }, []);

  /**
   * @description 직접 입력된 회사명 확인 버튼 핸들러
   */
  const handleConfirm = () => {
    onSelectCompany(manualInput);
    reset();
    onClose();
  };

  /**
   * @description 검색 결과 목록 항목 클릭 핸들러
   */
  const handleClickItem = (company: string) => {
    onSelectCompany(company);
    reset();
    onClose();
  };

  /**
   * @description 회사 검색 시작 핸들러
   */
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault(); // 폼 제출 기본 동작 방지

    setResults([]); // 기존 결과 목록 초기화
    search(); // 새 검색 수행 (페이지는 훅 내부에서 1로 리셋됨)
  };

  if (!isOpen) return null; // 모달이 닫힌 상태면 렌더링 안 함

  return (
    <Overlay>
      <ModalContainer>
        <TitleWrapper>
          <Title>회사명 조회</Title>
          <IoCloseOutline
            size={30}
            onClick={() => {
              onClose();
              reset(); // 닫을 때 상태 초기화
            }}
          />
        </TitleWrapper>

        <SearchForm onSubmit={handleSearch}>
          <SearchWrapper>
            {/* 검색어 입력 필드 */}
            <CompanyInputWrapper>
              <Input
                placeholder="회사명"
                width="100%"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </CompanyInputWrapper>

            {/* 검색 버튼 */}
            <Button
              type="submit"
              isActive={true}
              width={91}
              onClick={handleSearch}
            >
              검색
            </Button>
          </SearchWrapper>

          {/* 검색 결과 목록 및 무한 스크롤 영역 */}
          <Result ref={resultRef}>
            <ul>
              {/* 초기 검색 로딩 (결과가 없을 때) */}
              {loading && results.length === 0 && (
                <LoaderOverlay>
                  <FadeLoader
                    color={colors.maincolor}
                    loading={loading}
                    height={15}
                    width={5}
                    radius={2}
                    margin={2}
                  />
                </LoaderOverlay>
              )}
              {/* 검색 결과 항목 */}
              {results.map((company: string, idx: number) => {
                const isLast = idx === results.length - 1;
                return (
                  <ResultListItem
                    key={`${company}-${idx}`} // 문자열 + 인덱스 조합
                    onClick={() => handleClickItem(company)} // 항목 클릭 시 선택 처리
                  >
                    {company}
                  </ResultListItem>
                );
              })}
            </ul>

            {/* 스크롤 페이징 로더 (결과가 이미 있을 때) */}
            {loading && results.length > 0 && (
              <ScrollLoaderWrapper>
                <FadeLoader
                  color={colors.maincolor}
                  loading={loading}
                  height={15}
                  width={5}
                  radius={2}
                  margin={2}
                />
              </ScrollLoaderWrapper>
            )}
          </Result>

          {/* 직접 입력 필드 */}
          <InputWrapper>
            <Input
              placeholder="직접 입력"
              width="100%"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
            />
          </InputWrapper>
        </SearchForm>

        {/* 확인 버튼 (직접 입력 값 확정) */}
        <ButtonWrapper>
          <Button onClick={handleConfirm} isActive={true}>
            확인
          </Button>
        </ButtonWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default SearchModal;

// --- styled ---
const maxWidth = "29rem";
const maxHeight = "30rem";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  position: relative; /* 기준 */

  max-width: ${maxWidth};
  max-height: ${maxHeight};
  //   height: ${maxHeight};
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 72px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 24px;
`;

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const SearchWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const CompanyInputWrapper = styled.div`
  width: 70.14%;
  margin-right: 12px;
`;

const Result = styled.div`
  position: relative;

  min-height: 72px;
  max-height: 7.5rem;
  padding-top: 11px;
  padding-left: 12px;

  border: 1px solid ${colors.graycolor10};
  border-radius: 8px;
  margin-bottom: 12px;

  ul {
    list-style: none;
  }

  overflow-y: auto;
`;

const LoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  inset: 0;

  transform: scale(0.7);
  background: rgba(255, 255, 255, 0.7); /* 약간 투명한 흰색 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ResultListItem = styled.li`
  font-size: 14px;
  font-weight: 500;
  color: ${colors.graycolor50};
  cursor: pointer;
  text-decoration: none;
  margin-bottom: 10px;

  &:hover {
    text-decoration: underline;
    color: ${colors.graycolor100};
  }
`;

const InputWrapper = styled.div`
  margin-bottom: 32px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const ScrollLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  transform: scale(0.7);
  align-items: center;
  padding: 12px 0;
`;
