import { create } from "zustand";

interface LoaderState {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  loading: false,
  startLoading: () => set({ loading: true }),
  stopLoading: () => set({ loading: false }),
}));
