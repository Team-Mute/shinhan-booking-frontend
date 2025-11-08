import { ReservationStatus } from "@admin/types/dashBoardAdmin";

/**
 * API로부터 받은 상태 ID를 내부 키로 매핑
 * (하위 호환성 유지)
 */
export const API_ID_TO_STATUS_KEY: Record<number, string> = {
  1: "FIRST_APPROVAL_PENDING",
  2: "SECOND_APPROVAL_PENDING",
  3: "FINAL_APPROVED",
  4: "REJECTED",
  5: "COMPLETED",
  6: "CANCELLED",
};

/**
 * 상태 키를 API ID로 변환 (역방향 매핑)
 */
export const STATUS_KEY_TO_API_ID: Record<string, number> = {
  FIRST_APPROVAL_PENDING: 1,
  SECOND_APPROVAL_PENDING: 2,
  FINAL_APPROVED: 3,
  REJECTED: 4,
  COMPLETED: 5,
  CANCELLED: 6,
};

/**
 * 상태 키를 한글 레이블로 변환
 */
export const STATUS_ID_TO_LABEL: Record<string, string> = {
  FIRST_APPROVAL_PENDING: "1차 승인 대기",
  SECOND_APPROVAL_PENDING: "2차 승인 대기",
  FINAL_APPROVED: "최종 승인 완료",
  COMPLETED: "이용 완료",
  CANCELLED: "예약 취소",
  REJECTED: "반려",
};

/**
 * 레이블을 statusKey로 변환 (역방향)
 */
export const STATUS_LABEL_TO_KEY: Record<string, string> = {
  "1차 승인 대기": "FIRST_APPROVAL_PENDING",
  "2차 승인 대기": "SECOND_APPROVAL_PENDING",
  "최종 승인 완료": "FINAL_APPROVED",
  "이용 완료": "COMPLETED",
  "예약 취소": "CANCELLED",
  "반려": "REJECTED",
};

/**
 * localStorage 키
 */
export const STORAGE_KEYS = {
  VISIBLE_STATUSES: 'dashboard-visible-statuses',
} as const;

/**
 * 기본 표시 상태 (상태 키 기반)
 * - 페이지 최초 로드 시 표시될 상태들
 */
export const DEFAULT_VISIBLE_STATUSES = [
  "FIRST_APPROVAL_PENDING",
  "SECOND_APPROVAL_PENDING",
  "FINAL_APPROVED",
  "COMPLETED",
];

/**
 * 캘린더 설정 옵션 타입
 * 
 * @description
 * - API에서 받은 상태 정보를 프론트엔드에서 사용하기 위한 형식
 * - CalendarSettingModal과 CalendarHeader에서 사용
 */
export interface StatusOption {
  id: string;        // 상태 키 (예: "FIRST_APPROVAL_PENDING")
  label: string;     // 한글 레이블 (예: "1차 승인 대기")
  color: string;     // Dot/체크박스 색상 (예: "#FFBB00")
  apiId: number;     // API ID (예: 1)
}