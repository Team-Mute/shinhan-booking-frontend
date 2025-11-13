/**
 * 예약 관련 DTO 모음
 *
 * - 예약 목록 조회 요청: ReservListParams
 * - 예약 목록 조회 응답: ReservListResponse
 *
 * - 예약 생성 요청: ReservCreateBody
 * - 예약 생성 응답: ReservCreateResponse
 *
 * - 예약 취소 요청: ReservCancelParams
 * - 예약 취소 응답: ReservCancelResponse
 *
 * - 예약 가능 시간 조회 요청: ReservPossibleTimeBody
 * - 예약 가능 시간 조회 응답: ReservPossibleTimeResponse
 *
 * - 예약 가능 날짜 조회 요청: ReservPossibleDateBody
 * - 예약 가능 날짜 조회 응답: ReservPossibleDateResponse
 *
 * - 예약 단건 조회 요청: ReservDetailParams
 * - 예약 단건 조회 응답: ReservDetailResponse
 *
 * - 예약 삭제 요청: ReservDeleteParams
 *
 * - 예약 반려 메시지 조회 요청: ReservRejectMsgParams
 * - 예약 반려 메시지 조회 응답: ReservRejectMsgResponse
 *
 */

// 사전 답사 정보 타입
export type PrevisitInfo = {
  previsitFrom: string;
  previsitTo: string;
};

// 예약 등록 Payload 타입
export type ReservPayload = {
  spaceId: number;
  reservationHeadcount: number;
  reservationFrom: string;
  reservationTo: string;
  reservationPurpose: string;
  reservationAttachments: string[];
  // existingAttachments?: string[];
  previsitInfo: PrevisitInfo;
};

// 시간 타입 (시, 분, 초, 나노)
export type Time = {
  hour: number;
  minute: number;
  second: number;
  nano: number;
};

// 시작시간 - 종료시간 타입
export type FromToTime = {
  startTime: Time;
  endTime: Time;
};

/** 예약 목록 조회 요청 DTO */
export type ReservListParams = {
  filterOption: string;
  page: number;
  size: number;
};

/** 예약 목록 조회 응답 DTO */
export type ReservListResponse = {
  content: [];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

/** 예약 생성 요청 DTO */
export type ReservCreateBody = {
  requestDto: ReservPayload;
  files: File[];
};

/** 예약 생성 응답 DTO */
export type ReservCreateResponse = ReservPayload & {
  reservationId: number;
  orderId: string;
  spaceName: string;
  userId: number;
  userName: string;
  reservationStatusId: number;
  reservationStatusName: string;
  regDate: string;
  updDate: string;
};

/** 예약 취소 요청 DTO */
export type ReservCancelParams = { reservation_id: number }; // Pick<ReservCreateResponse, "reservationId">;

/** 예약 취소 응답 DTO */
export type ReservCancelResponse = {
  reservationId: number;
  fromStatus: string;
  toStatus: string;
  approvedAt: string;
  message: string;
};

/** 예약 가능 시간 조회 요청 DTO */
export type ReservPossibleTimeBody = {
  spaceId: number;
  year: number;
  month: number;
  day: number;
};

/** 예약 가능 시간 조회 응답 DTO */
export type ReservPossibleTimeResponse = {
  availableTimes: FromToTime[];
};

/** 예약 가능 날짜 조회 요청 DTO */
export type ReservPossibleDateBody = {
  spaceId: number;
  year: number;
  month: number;
};

/** 예약 가능 날짜 조회 응답 DTO */
export type ReservPossibleDateResponse = {
  availableDays: number[];
};

/** 예약 단건 조회 요청 DTO */
export type ReservDetailParams = { reservation_id: number }; // Pick<ReservCreateResponse, "reservationId">;

/** 예약 단건 조회 응답 DTO */
export type ReservDetailResponse = {
  reservationId: number;
  orderId: string;
  spaceImageUrl: string;
  spaceName: string;
  reservationFrom: string;
  reservationTo: string;
  reservationHeadcount: number;
  reservationPurpose: string;
  previsits: PrevisitInfo & { previsitId: number };
  reservationAttachment: string[];
};

/** 예약 삭제 요청 DTO */
export type ReservDeleteParams = { reservation_id: number }; // Pick<ReservCreateResponse, "reservationId">;

/** 예약 반려 메시지 조회 요청 DTO */
export type ReservRejectMsgParams = { reservation_id: number }; // Pick<ReservCreateResponse, "reservationId">;

/** 예약 반려 메시지 조회 응답 DTO */
export type ReservRejectMsgResponse = {
  memo: string;
};
