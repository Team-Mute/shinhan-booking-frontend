import { ReservationStatus } from "@admin/types/dashBoardAdmin";

/**
 * 예약 상태별 색상 매핑
 */
export const STATUS_COLORS: Record<ReservationStatus, string> = {
  "1차 승인 대기": "#FFBB00",
  "2차 승인 대기": "#FF7300",
  "최종 승인 완료": "#34C759",
  "이용 완료": "#8496C5",
  긴급: "#FF0000",
  신한: "#0046FF",
  "예약 취소": "#8E8E93",
  "반려": "#C800FF",
};

/**
 * statusId와 label 간 매핑
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
 * statusId를 API의 숫자 ID로 변환
 */
export const STATUS_ID_TO_API_ID: Record<string, number> = {
  FIRST_APPROVAL_PENDING: 1,
  SECOND_APPROVAL_PENDING: 2,
  FINAL_APPROVED: 3,
  REJECTED: 4,
  COMPLETED: 5,
  CANCELLED: 6,
};

/**
 * 레이블을 statusKey로 변환 (상태만 해당)
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
 * 기본 표시 상태
 */
export const DEFAULT_VISIBLE_STATUSES = [
  "FIRST_APPROVAL_PENDING",
  "SECOND_APPROVAL_PENDING",
  "FINAL_APPROVED",
  "COMPLETED",
];