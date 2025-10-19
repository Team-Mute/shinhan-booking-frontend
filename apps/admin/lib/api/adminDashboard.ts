import { DashBoardCard, RawReservationData } from "@/types/dashBoardAdmin";
import adminAxiosClient from "./adminAxiosClient";

// 대시보드 카드 API
export const getDashboardCardApi = async (): Promise<DashBoardCard[]> => {
  const response = await adminAxiosClient.get(`/api/dashboard-admin/counts`);
  return response.data;
};

// 캘린더 API
export const getDashboardReservationsApi = async (): Promise<RawReservationData[]> => {
  const response = await adminAxiosClient.get(`/api/dashboard-admin/list`);
  return response.data;
};