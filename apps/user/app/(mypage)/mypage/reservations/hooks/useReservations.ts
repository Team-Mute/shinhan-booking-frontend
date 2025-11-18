// ./hooks/useReservations.ts

"use client";

import { useState, useEffect, useMemo } from "react";
import { getReservationListApi } from "@user/lib/api/reservation";
import {
  ReservListDetailContent,
  ReservListResponse, // 서버 응답 타입 추가 (필요하다면)
} from "@user/types/reservation.dto";

export interface Reservation {
  reservationId: number;
  id: string;
  status: "진행중" | "예약완료" | "이용완료" | "예약취소" | "취소" | "반려";
  spaceId: number;
  location: string;
  mainDate: string;
  mainTime: string;
  preVisitDate?: string;
  preVisitTime?: string;
}

// --- 유틸리티 함수 (동일) ---
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return {
    formattedDate: `${year}년 ${month}월 ${day}일 (${dayOfWeek})`,
    formattedTime: `${hours}:${minutes}`,
  };
};

const mapApiDataToReservation = (
  apiData: ReservListDetailContent
): Reservation => {
  const start = formatDateTime(apiData.reservationFrom);
  const end = formatDateTime(apiData.reservationTo);

  let preVisitInfo = {};
  if (Array.isArray(apiData.previsits) && apiData.previsits.length > 0) {
    const previsit = apiData.previsits[0];
    const preStart = formatDateTime(previsit.previsitFrom);
    const preEnd = formatDateTime(previsit.previsitTo);
    preVisitInfo = {
      preVisitDate:
        preStart.formattedDate === preEnd.formattedDate
          ? preStart.formattedDate
          : `${preStart.formattedDate} ~ ${preEnd.formattedDate}`,
      preVisitTime: `${preStart.formattedTime} ~ ${preEnd.formattedTime}`,
    };
  }

  // 상태 매핑
  let uiStatus: Reservation["status"] =
    apiData.reservationStatusName as Reservation["status"];
  if (uiStatus === "예약취소") uiStatus = "취소";

  return {
    reservationId: apiData.reservationId,
    id: apiData.orderId,
    status: uiStatus,
    spaceId: apiData.spaceId,
    location: apiData.spaceName,
    mainDate:
      start.formattedDate === end.formattedDate
        ? start.formattedDate
        : `${start.formattedDate} ~ ${end.formattedDate}`,
    mainTime: `${start.formattedTime} ~ ${end.formattedTime}`,
    ...preVisitInfo,
  };
};

// 탭 상태를 API filterOption 값으로 매핑하는 함수
const getFilterOption = (tab: string): string => {
  if (tab === "전체") return "";
  if (tab === "취소") return "취소"; // 여러 상태를 콤마로 구분하여 전달
  return tab; // 진행중, 예약완료, 이용완료는 그대로 전달
};

export const useReservations = (itemsPerPage = 5) => {
  const [paginatedReservations, setPaginatedReservations] = useState<
    Reservation[]
  >([]);
  const [activeTab, setActiveTab] = useState<string>("전체");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReservations = async (page: number, tab: string, term: string) => {
    setIsLoading(true);
    setCurrentPage(page); // API 호출 직전에 현재 페이지 설정

    const filterOption = getFilterOption(tab);

    try {
      const data = await getReservationListApi({
        filterOption: filterOption,
        page: page, // 현재 페이지 번호
        size: itemsPerPage, // 한 페이지당 아이템 수
      });

      if (data) {
        setPaginatedReservations(data.content.map(mapApiDataToReservation));
        setTotalPages(data.totalPages); // 서버 응답에서 총 페이지 수 설정
      } else {
        setPaginatedReservations([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("예약 목록 불러오기 실패", err);
      setPaginatedReservations([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // 탭 또는 검색어 변경 시
  useEffect(() => {
    // 탭, 검색어 변경 시 1페이지부터 다시 시작
    fetchReservations(1, activeTab, searchTerm);
  }, [activeTab, searchTerm, itemsPerPage]); // itemsPerPage가 변경될 일은 없겠지만 의존성 추가

  // 페이지 변경 시
  useEffect(() => {
    fetchReservations(currentPage, activeTab, searchTerm);
  }, [currentPage]); // currentPage만 의존성으로 추가

  // 탭 변경 핸들러 수정: 페이지를 1로 리셋하고 탭 상태만 변경
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // 탭 변경 시 1페이지로 이동
    // fetchReservations는 activeTab/currentPage 변경 useEffect에서 처리됨
  };

  // 검색어 변경 핸들러 수정: 페이지를 1로 리셋하고 검색어 상태만 변경
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // 검색 시 1페이지로 이동
  };

  return {
    activeTab,
    setActiveTab: handleTabChange, // 수정된 핸들러 사용
    searchTerm,
    setSearchTerm: handleSearchChange, // 수정된 핸들러 사용
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedReservations,
    isLoading, // 로딩 상태 추가
  };
};
