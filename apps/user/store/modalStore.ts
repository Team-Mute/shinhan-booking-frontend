import { create } from "zustand";

interface ModalState {
  isOpen: boolean; // 모달 열림 상태
  title: string; // 모달 제목
  subtitle: string; // 모달 부제목/내용
  onClose?: () => void; // 모달이 닫힐 때 실행할 콜백 함수

  open: (title: string, subtitle: string, onClose?: () => void) => void; // 모달 열기 함수
  close: () => void; // 모달 닫기 함수
}

/**
 * useModalStore
 * -------------------
 * 전역에서 사용되는 InfoModal의 상태를 관리하는 Zustand 스토어.
 *
 * @description
 * - 애플리케이션 전반의 알림/안내 모달을 제어하는 데 사용됨.
 * - 'close' 함수 호출 시 등록된 'onClose' 콜백을 실행하고 모달을 닫음.
 */
export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: "",
  subtitle: "",
  onClose: undefined,

  /**
   * @description 모달을 열고 제목, 내용, 닫기 콜백을 설정
   */
  open: (title, subtitle, onClose) =>
    set({ isOpen: true, title, subtitle, onClose }),

  /**
   * @description 모달을 닫고, 등록된 onClose 콜백을 실행
   */
  close: () =>
    set((state) => {
      state.onClose?.(); // 모달 닫기 전 콜백 함수 실행
      return { isOpen: false, onClose: undefined }; // 상태 초기화 및 닫기
    }),
}));
