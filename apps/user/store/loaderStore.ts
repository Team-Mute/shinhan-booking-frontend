import { create } from "zustand";

interface LoaderState {
  loading: boolean; // 로딩 상태 (true: 로딩 중, false: 로딩 완료)
  startLoading: () => void; // 로딩 시작 함수
  stopLoading: () => void; // 로딩 중지 함수
}

/**
 * useLoaderStore
 * -------------------
 * 애플리케이션 전역 로딩 상태를 관리하는 Zustand 스토어.
 *
 * @description
 * - 주로 API 호출이나 비동기 작업 시 화면에 로딩 인디케이터를 표시하기 위해 사용됨.
 */
export const useLoaderStore = create<LoaderState>((set) => ({
  loading: false, // 초기 상태: 로딩 아님
  startLoading: () => set({ loading: true }), // 로딩 상태를 true로 설정
  stopLoading: () => set({ loading: false }), // 로딩 상태를 false로 설정
}));
