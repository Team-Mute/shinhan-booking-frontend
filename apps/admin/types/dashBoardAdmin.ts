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

export type ReservationStatus =
  | "1차 승인 대기"
  | "2차 승인 대기"
  | "최종 승인 완료"
  | "이용 완료"
  | "긴급"
  | "신한";

/**
 * API 응답 데이터를 가공하여 캘린더에 표시하기 위한 타입입니다.
 */
export interface ProcessedReservation {
  id: number;
  date: string; // 예약 날짜 (YYYY-MM-DD)
  time: string; // 예약 시간 (HH:mm ~ HH:mm)
  user: string; // 예약자 이름
  status: ReservationStatus; // 예약 상태 (가공된 값)
}
