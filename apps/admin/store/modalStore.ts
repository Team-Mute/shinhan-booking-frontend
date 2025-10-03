import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  title: string;
  subtitle: string;
  onClose?: () => void;

  open: (title: string, subtitle: string, onClose?: () => void) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: "",
  subtitle: "",
  onClose: undefined,
  open: (title, subtitle, onClose) =>
    set({ isOpen: true, title, subtitle, onClose }),
  close: () =>
    set((state) => {
      state.onClose?.(); // 모달 닫힐 때 콜백 실행
      return { isOpen: false, onClose: undefined };
    }),
}));
