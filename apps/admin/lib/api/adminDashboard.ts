import { DashBoardCard, RawReservationData, StatusFilter } from "@admin/types/dashBoardAdmin";
import adminAxiosClient from "./adminAxiosClient";

/**
 * 예약 상태 필터 옵션 조회 (DB 기반)
 */
export const getDashboardFiltersApi = async (): Promise<StatusFilter[]> => {
  try {
    const response = await adminAxiosClient.get<StatusFilter[]>(
      '/api/dashboard-admin/filters'
    );
    return response.data;
  } catch (error) {
    console.error('예약 상태 필터 조회 실패:', error);
    throw error;
  }
};

// 대시보드 카드 API
export const getDashboardCardApi = async (): Promise<DashBoardCard[]> => {
  const response = await adminAxiosClient.get(`/api/dashboard-admin/counts`);
  return response.data;
};

// 캘린더 API
export const getDashboardReservationsApi = async (
  year: number,
  month: number,
  statusIds: number[]
): Promise<RawReservationData[]> => {
  const response = await adminAxiosClient.get(`/api/dashboard-admin/list`, {
    params: {
      year,
      month,
      statusIds,
    },
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      searchParams.append('year', params.year.toString());
      searchParams.append('month', params.month.toString());
      params.statusIds.forEach((id: number) => {
        searchParams.append('statusIds', id.toString());
      });
      return searchParams.toString();
    },
  });
  return response.data;
};

/**
 * 특정 날짜의 예약 목록 조회 (상태 필터링 포함)
 * @param date YYYY-MM-DD 형식의 날짜
 * @param statusIds 조회할 상태 ID 배열
 */
export const getDashboardReservationsByDateApi = async (
  date: string,
  statusIds: number[]
): Promise<RawReservationData[]> => {
  try {
    // statusIds를 쉼표로 구분된 문자열로 변환
    const statusIdsParam = statusIds.join(',');
    
    const response = await adminAxiosClient.get<RawReservationData[]>(
      `/api/dashboard-admin/list/by-date`,
      {
        params: {
          date,
          statusIds: statusIdsParam,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('특정 날짜 예약 목록 조회 실패:', error);
    throw error;
  }
};
