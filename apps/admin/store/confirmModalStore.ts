import { create } from "zustand";

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  subtitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  
  // 모달을 열고 상태를 설정하는 함수
  open: (
    title: string,
    subtitle: string,
    onConfirm: () => void,
    onCancel: () => void
  ) => void;
  
  // 모달을 닫는 함수 (취소 및 확인 시 모두 사용)
  close: () => void;
}

export const useConfirmModalStore = create<ConfirmModalState>((set) => ({
  isOpen: false,
  title: "",
  subtitle: "",
  onConfirm: () => {}, // 기본값으로 빈 함수 설정
  onCancel: () => {},  // 기본값으로 빈 함수 설정

  open: (title, subtitle, onConfirm, onCancel) =>
    set({
      isOpen: true,
      title,
      subtitle,
      onConfirm,
      onCancel,
    }),

  close: () => set({ 
    isOpen: false, 
    // 모달을 닫은 후 콜백 함수들을 초기화하여 메모리 누수를 방지하고 다음 호출을 위해 준비
    onConfirm: () => {}, 
    onCancel: () => {},
  }),
}));