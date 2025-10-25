/**
 * 예약 관리 관련 DTO 및 모델 모음
 *
 * 📌 네이밍 규칙:
 * - 순수 데이터 모델 (컴포넌트 props용): XXXModel
 * - 요청 파라미터: XXXParams
 * - 응답 데이터: XXXResponse
 * - 목록 항목 DTO: XXXListItemDTO
 * - 요청/응답 공통 옵션 데이터: XXXOptionDTO
 *
 * - 예약 목록 조회 요청: ReservationListParams
 * - 예약 목록 조회 응답: ReservationListResponse
 * - 예약 상세 조회 응답: ReservationDetailResponse
 * - 예약 승인/반려 요청: ReservationActionParams
 * - 예약 승인/반려 응답: ReservationApproveResponse
 *
 * - 예약 목록 항목 DTO: ReservationListItemDTO
 * - 예약 상세 정보 DTO: ReservationDetailResponse
 * - 예약 기본 모델: ReservationModel
 *
 * - 예약 상태 옵션 DTO: StatusOptionDTO
 * - 지역 옵션 DTO: RegionOptionDTO
 * - 플래그 옵션 DTO: FlagOptionDTO
 *
 * - 사전답사 정보 DTO: PrevisitDTO
 */

/** 예약 상태 옵션 DTO */
export interface StatusOptionDTO {
  id: number;
  label: string;
}

/** 지역 옵션 DTO */
export interface RegionOptionDTO {
  regionId: number;
  regionName: string;
}

/** 플래그 옵션 DTO */
export interface FlagOptionDTO {
  key: string;
  label: string;
}

// --- 예약 데이터 DTO 및 모델 ---

/** 사전답사 정보 DTO */
export interface PrevisitDTO {
  previsitId: number;
  previsitFrom: string;
  previsitTo: string;
}

/** 예약 목록의 한 항목 DTO */
export interface ReservationListItemDTO {
  reservationId: number;
  reservationStatusName: string;
  spaceName: string;
  userName: string;
  reservationHeadcount: number;
  reservationFrom: string;
  reservationTo: string;
  regDate: string;
  isShinhan: boolean;
  isEmergency: boolean;
  isApprovable: boolean;
  isRejectable: boolean;
  previsits: PrevisitDTO[];
  regionId: number;
  statusId: number;
}

/**
 * 컴포넌트 Props 등에서 사용되는 예약 기본 모델 (Reservation의 역할 유지)
 * ReservationListItemDTO와 동일한 구조를 가지지만, 컴포넌트에서 순수 데이터 모델로 사용됨을 명시
 */
export interface ReservationModel extends ReservationListItemDTO {}

/** 예약 목록 조회 요청 DTO */
export interface ReservationListParams {
  page: number;
  size: number;
  keyword?: string;
  statusId?: number | null;
  regionId?: number | null;
  isShinhan?: boolean;
  isEmergency?: boolean;
}

/** 예약 목록 조회 응답 DTO */
export interface ReservationListResponse {
  content: ReservationListItemDTO[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/** 예약 상세 조회 응답 DTO */
export interface ReservationDetailResponse {
  reservationId: number;
  spaceName: string;
  user: {
    id: number;
    name: string;
    email: string;
    company: string;
  };
  reservationPurpose: string;
  reservationHeadcount: number;
  reservationFrom: string;
  reservationTo: string;
  orderId: string;
  reservationStatusName: string;
  isApprovable: boolean;
  isRejectable: boolean;
  previsits?: {
    previsitFrom: string;
    previsitTo: string;
  }[];
  statusId: number;
}

/** 예약 승인/반려 개별 처리 결과 DTO */
export interface ApproveResultDTO {
    reservationId: number;
    success: boolean;
    message: string;
}

/** 예약 일괄 승인/반려 응답 DTO */
export interface ReservationApproveResponse {
  total: number;
  successCount: number;
  failureCount: number;
  results: ApproveResultDTO[];
}