import { create } from "zustand";

type ReservationTime = {
  start: string | undefined;
  end: string | undefined;
};

// --- 필터 상태 타입 정의 ---
// 사용자가 검색 페이지에서 선택한 필터 조건을 저장
type FilterStore = {
  regionId: number | undefined; // 선택된 지역 ID
  capacity: number | undefined; // 선택된 인원 수
  startDate: string | undefined; // 선택된 시작 날짜 (YYYY-MM-DD)
  endDate: string | undefined; // 선택된 종료 날짜 (YYYY-MM-DD)
  time: ReservationTime | undefined; // 선택된 시간 범위

  tagNames: string[] | undefined; // 선택된 태그 배열

  // 필터 상태 업데이트 함수
  setFilters: (filters: Partial<FilterStore>) => void;

  // 필터 상태 초기화 함수
  clearFilters: () => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  regionId: 1,
  capacity: undefined,
  startDate: undefined,
  endDate: undefined,
  time: undefined,
  tagNames: undefined,

  setFilters: (filters) =>
    set((state) => {
      const newState = { ...state, ...filters };
      // 4. 상태 업데이트
      return newState;
    }),

  clearFilters: () =>
    set({
      regionId: 1,
      capacity: undefined,
      startDate: undefined,
      endDate: undefined,
      time: undefined,
      tagNames: undefined,
    }),
}));
