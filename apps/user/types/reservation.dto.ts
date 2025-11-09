// 예약 요청 타입
export interface ReservationRequest {
  requestDto: ReservationPayload;
  files: File[];
}

// 예약 등록/수정 Request body 타입
export interface ReservationPayload {
  spaceId: number;
  reservationHeadcount: number;
  reservationFrom: string;
  reservationTo: string;
  reservationPurpose: string;

  existingAttachments?: string[];
}
