import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AdminSignUpData {
  roleId?: number;
  regionName?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
}

interface AdminAuthState {
  // 관리자 토큰
  adminAccessToken: string | null;
  setAdminAccessToken: (token: string) => void;

  // 관리자 roleId
  adminRoleId: number | null;
  setAdminRoleId: (roleId: number) => void;

  clearAdminAuth: () => void;

  // 관리자 회원가입 데이터
  adminSignUpData: AdminSignUpData | null;
  setAdminSignUpData: (data: AdminSignUpData) => void;
  clearAdminSignUpData: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminAccessToken: null,
      adminRoleId: null,

      setAdminAccessToken: (token) => set({ adminAccessToken: token }),
      setAdminRoleId: (roleId) => set({ adminRoleId: roleId }),
      clearAdminAuth: () => set({ adminAccessToken: null, adminRoleId: null }),

      // 회원가입 관련 초기 상태
      adminSignUpData: null,
      setAdminSignUpData: (data) => set({ adminSignUpData: data }),
      clearAdminSignUpData: () => set({ adminSignUpData: null }),

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "admin-auth", // localStorage key
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
