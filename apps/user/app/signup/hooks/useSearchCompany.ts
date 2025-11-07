import { searchCompanyApi } from "@user/lib/api/company";
import { useCallback, useState, useRef } from "react";

/**
 * useSearchCompany 훅
 * -------------------
 * 회사명 검색 기능(검색, 무한 스크롤 페이징)을 관리하는 커스텀 훅.
 *
 * @returns {object} 검색 상태, 검색어, 결과 목록 및 관련 제어 함수.
 */
export function useSearchCompany() {
  const [query, setQuery] = useState(""); // 현재 검색어 상태
  const [pageNo, setPageNo] = useState(1); // 현재 페이지 번호 (요청 시 사용)
  const [results, setResults] = useState<string[]>([]); // 검색 결과 목록
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 존재 여부

  // 이전 검색 요청을 취소하기 위한 AbortController 참조
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * @description 검색 버튼 클릭 시 실행되는 초기 검색 로직.
   * 이전 요청을 취소하고 첫 페이지(pageNo: 1) 데이터를 로드.
   */
  const search = useCallback(async () => {
    if (!query) return; // 검색어가 없으면 실행 안 함
    setLoading(true);

    // 이전 요청이 있다면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await searchCompanyApi({ corpNm: query, pageNo: 1 });

      setResults(response.data.item); // 결과 목록 설정
      setPageNo(response.data.pageNo + 1); // 다음 요청을 위해 페이지 번호 증가
      setHasMore(response.data.item.length > 0); // 결과가 있으면 다음 페이지 존재 가능성 있음
    } finally {
      setLoading(false);
    }
  }, [query]);

  /**
   * @description 스크롤 시 실행되는 추가 데이터 로드 로직 (무한 스크롤).
   * 현재 pageNo를 사용하여 다음 페이지 데이터를 로드.
   */
  const loadMore = useCallback(async () => {
    if (!query || !hasMore) return; // 검색어 없거나 더 이상 데이터가 없으면 실행 안 함
    setLoading(true);
    try {
      // 현재 pageNo로 요청
      const response = await searchCompanyApi({ corpNm: query, pageNo });

      setResults((prev) => [...prev, ...response.data.item]); // 기존 결과에 새 결과 추가
      setPageNo(response.data.pageNo + 1); // 다음 요청을 위해 페이지 번호 증가
      setHasMore(response.data.item.length > 0); // 결과가 없으면 hasMore = false
    } finally {
      setLoading(false);
    }
  }, [query, pageNo, hasMore]);

  return {
    query,
    setQuery,
    results,
    search,
    loadMore,
    loading,
    hasMore,
    setResults,
    setHasMore,
    setPageNo,
  };
}
