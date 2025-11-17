"use client";

import { useState, useEffect, useMemo } from "react";
import { getReservationListApi } from "@user/lib/api/reservation";
import { ReservListDetailContent } from "@user/types/reservation.dto";

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

// --- 유틸리티 함수 ---
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
  let uiStatus = apiData.reservationStatusName;
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

export const useReservations = (itemsPerPage = 5) => {
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<string>("전체");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchAllReservations = async () => {
    try {
      const data = await getReservationListApi({
        filterOption: "",
        page: 1,
        size: 9999,
      }); // 전체 불러오기
      if (data?.content) {
        setAllReservations(data.content.map(mapApiDataToReservation));
      }
    } catch (err) {
      console.error("예약 목록 불러오기 실패", err);
      setAllReservations([]);
    }
  };

  useEffect(() => {
    fetchAllReservations();
  }, []);

  // --- 탭 & 검색 필터링 ---
  const filteredReservations = useMemo(() => {
    let filtered = allReservations;
    if (activeTab !== "전체") {
      filtered = filtered.filter((r) => r.status === activeTab);
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter((r) =>
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [allReservations, activeTab, searchTerm]);

  // --- 페이지네이션 ---
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredReservations.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredReservations, currentPage, itemsPerPage]);

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedReservations,
    itemsPerPage,
  };
};
