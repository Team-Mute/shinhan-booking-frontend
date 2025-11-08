// types/dashBoardAdmin.ts

export interface DashBoardCard {
  label: string;
  count: number;
}

export interface RawReservationData {
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
  previsits: Previsit[];
  regionId: number;
  statusId: number;
}

export interface Previsit {
  previsitId: number;
  previsitFrom: string;
  previsitTo: string;
}

/**
 * 예약 상태 타입
 * 
 * @description
 * - 기본 상태는 하드코딩되어 있지만, API에서 받은 description 값도 허용
 * - 이를 통해 DB에 새로운 상태가 추가되어도 타입 에러 없이 동작
 */
export type ReservationStatus =
  | "1차 승인 대기"
  | "2차 승인 대기"
  | "최종 승인 완료"
  | "이용 완료"
  | "예약 취소"
  | "반려"
  | "긴급"  // 특수 플래그
  | "신한"  // 특수 플래그
  | string; // API에서 추가된 새로운 상태 허용

/**
 * API 응답 데이터를 가공하여 캘린더에 표시하기 위한 타입입니다.
 */
export interface ProcessedReservation {
  id: number;
  dates: string[]; // 예약 날짜 배열 (YYYY-MM-DD) - 여러 날짜에 걸친 예약 지원
  time: string; // 예약 시간 (HH:mm ~ HH:mm)
  user: string; // 예약자 이름
  status: ReservationStatus; // 예약 상태 (가공된 값)
}

/**
 * 예약 상태 필터 (API 응답)
 */
export interface StatusFilter {
  id: number;
  description: string;
  type: string;
}

/**
 * 예약 상태 정보 (확장된 정보)
 */
export interface ReservationStatusInfo {
  id: number;
  key: string; // 내부 키 (예: "FIRST_APPROVAL_PENDING")
  label: string; // 표시 이름 (예: "1차 승인 대기")
  color: string; // 색상
  bgColor: string; // 배경색
}
