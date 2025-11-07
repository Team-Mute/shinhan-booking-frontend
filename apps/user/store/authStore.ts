import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * AuthState 인터페이스
 * --------------------
 * useAuthStore의 전역 인증 상태 타입 정의.
 */
interface AuthState {
  // 사용자 토큰
  accessToken: string | null;
  setAccessToken: (token: string) => void; // 토큰 설정 함수
  clearAuth: () => void; // 인증 정보 초기화 함수

  // Persist Hydration 상태
  _hasHydrated: boolean; // 스토어 데이터가 로컬 저장소에서 복원되었는지 여부
  setHasHydrated: (state: boolean) => void; // Hydration 상태 설정 함수
}

/**
 * useAuthStore
 * -------------
 * Zustand를 사용하여 사용자 인증 상태(accessToken)를 관리하는 스토어.
 * `persist` 미들웨어를 사용하여 토큰 상태를 `localStorage`에 유지.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // --- 토큰 상태 및 액션 ---
      // 초기 상태: 클라이언트 환경인 경우 localStorage에서 토큰을 읽어옴
      accessToken:
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null,

      /**
       * @description 액세스 토큰을 설정하고 localStorage에 저장
       */
      setAccessToken: (token) => {
        localStorage.setItem("accessToken", token); // localStorage에 저장
        set({ accessToken: token });
      },

      /**
       * @description 인증 정보를 초기화하고 localStorage에서 토큰을 제거
       */
      clearAuth: () => {
        localStorage.removeItem("accessToken"); // 로그아웃 시 제거
        set({ accessToken: null });
      },

      // --- Hydration 상태 및 액션 ---
      _hasHydrated: false, // 초기에는 복원되지 않은 상태
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "user-auth", // localStorage에 저장될 키 이름
      onRehydrateStorage: () => (state) => {
        // 복원이 완료되면 _hasHydrated 상태를 true로 설정하여 UI 렌더링 준비
        state?.setHasHydrated(true);
      },
    }
  )
);
