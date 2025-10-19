import { isAxiosError } from "axios";
import adminAxiosClient from "./adminAxiosClient";
import { ApproveResponse, FlagOption, Previsit, RegionOption, Reservation, ReservationDetail, ReservationResponse, ReservationsParams, StatusOption } from "@/types/reservationAdmin";

// 예약 관리 리스트 호출 API
export const getReservationApi = async ({
    page,
    size,
    keyword,
    statusId,
    regionId,
    isShinhan,
    isEmergency,
}: ReservationsParams): Promise<ReservationResponse> => {
    try {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (statusId !== null) params.append('statusId', String(statusId));
        if (regionId !== null) params.append('regionId', String(regionId));
        if (isShinhan) params.append('isShinhan', 'true');
        if (isEmergency) params.append('isEmergency', 'true');
        
        params.append('page', String(page));
        params.append('size', String(size));

        const url = `/api/reservations-admin/search?${params.toString()}`;
        
        const response = await adminAxiosClient.get<ReservationResponse>(url);
        return response.data;
        
    } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        throw new Error('데이터를 불러오지 못했습니다. 다시 시도해주세요.');
    }
};

/** 승인하기 API
 * 하나 또는 여러 개의 예약 ID를 배열로 받아 승인 요청 진행
 * @param reservationIds 승인할 예약 ID 배열
 */
export const postApproveReservationsApi = async (reservationIds: number[]): Promise<ApproveResponse> => {
    try {
        const response = await adminAxiosClient.post<ApproveResponse>(
            '/api/reservations-admin/approve',
            { reservationIds }
        );
        
        // axios는 2xx 상태 코드를 성공으로 간주하고 data를 반환합니다.
        // 200 OK일 경우 response.data에 JSON이 담겨 있습니다.
        return response.data;

    } catch (error) {
        // error가 AxiosError 타입인지 확인
        if (isAxiosError(error)) {
            // 서버가 응답을 보냈고, 그 상태 코드가 2xx가 아닌 경우
            if (error.response) {
                return error.response.data as ApproveResponse;
            } 
            // 요청은 보냈지만 응답을 받지 못한 경우 (네트워크 오류 등)
            else if (error.request) {
                console.error("API 요청 실패: 응답 없음", error.request);
                throw new Error("네트워크 오류가 발생했습니다.");
            }
            // 그 외 알 수 없는 오류
            else {
                console.error("API 요청 설정 오류:", error.message);
                throw new Error("API 요청 중 알 수 없는 오류가 발생했습니다.");
            }
        }
        // axios 에러가 아닐 경우
        console.error("알 수 없는 에러:", error);
        throw new Error("알 수 없는 오류가 발생했습니다.");
    }
};

/**
 * 예약 반려 API 
 * @param reservationId 반려할 예약 ID
 * @param rejectionReason 반려 사유
 */
export const postRejectReservationApi = async (reservationId: number, rejectionReason: string) => {
    // API 요청 형식에 맞춰 rejectionReason을 Body에 담아 보냅니다.
    const response = await adminAxiosClient.post(`/api/reservations-admin/reject/${reservationId}`, {
        rejectionReason: rejectionReason,
    });
    return response.data;
};

// 상세 조회 API
export const getReservationDetailApi = async (reservationId: number): Promise<ReservationDetail> => {
    try {
        const url = `/api/reservations-admin/detail/${reservationId}`;
        const response = await adminAxiosClient.get<ReservationDetail>(url);

        return response.data;
        
    } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        throw new Error('데이터를 불러오지 못했습니다. 다시 시도해주세요.');
    }
};

// 필터링 드롭 다운
export const getStatusOptions = async (): Promise<StatusOption[]> => {
  const response = await adminAxiosClient.get(`/api/reservations-admin/filter-options/statuses`);
  return response.data;
};

export const getRegionOptions = async (): Promise<RegionOption[]> => {
  const response = await adminAxiosClient.get(`/api/spaces/regions`);
  return response.data;
};

export const getFlagOptions = async (): Promise<FlagOption[]> => {
  const response = await adminAxiosClient.get(`/api/reservations-admin/filter-options/flags`);
  return response.data;
};