import { create } from "zustand";

type ReservationTime = {
  start: string | undefined;
  end: string | undefined;
};

type FilterStore = {
  regionId: number | undefined;
  capacity: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  time: ReservationTime | undefined;

  tagNames: string[] | undefined;

  setFilters: (filters: Partial<FilterStore>) => void;
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
      // 1. 갱신될 내용을 콘솔에 출력
      console.log("🚀 [FilterStore] New Filters Applied:", filters);

      // 2. 새로운 상태를 계산
      const newState = { ...state, ...filters };

      // 3. 최종 상태를 콘솔에 출력
      console.log("✅ [FilterStore] Current State:", newState);

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
